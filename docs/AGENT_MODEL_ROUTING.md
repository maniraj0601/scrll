# Agent, model, and cost/context routing

Which model tier a task gets, what happens when that tier fails, and how this setup keeps token
usage (and therefore cost) down on any machine. Grounded in
[Anthropic's own cost-reduction guidance](https://code.claude.com/docs/en/costs) and
[subagent design guidance](https://code.claude.com/docs/en/sub-agents) — this file applies that
guidance to this specific repo rather than restating it generically.

## Tiers

| Tier | Model | Use for | Examples in this repo |
| --- | --- | --- | --- |
| 1 | Haiku | Mechanical, deterministic, low-ambiguity. Output is checked by a script or a diff, not judgment. | `deploy-verifier` (build + asset-hash compare + header check) |
| 2 | Sonnet | Default for real engineering work: implementing a scoped change, reviewing a diff against known invariants, debugging with a clear repro. | `editor-ui-simplifier`, `engine-code-reviewer`, `video-pipeline-engineer`, `tech-planner`, most `/implement` work |
| 3 | Opus | High-ambiguity judgment: turning a vague ask into a precise spec, architectural tradeoffs with no clear precedent, synthesizing conflicting requirements. | `spec-author`, genuinely novel architecture decisions |

Default to Sonnet. Move up to Opus only when the task is actually open-ended (not just "hard to
debug" — a hard bug with a clear repro is still Tier 2). Move down to Haiku only when success is
checkable by a deterministic condition (exit code, string match, hash equality), not by reading the
output and judging it. Sonnet "handles most coding tasks well and costs less than Opus" per
Anthropic's own guidance — reserve Opus for the cases Tier 2 genuinely can't resolve.

## Fallback ladder

There is no runtime hook that lets a subagent silently swap itself to a cheaper model mid-run — the
tool only exposes the `model` override at the point an agent is *spawned*. So the fallback is the
orchestrator's (the main session's, or a command's) job, applied on retry:

```
Opus fails (rate-limited / overloaded / exhausted context) → retry once at Sonnet
Sonnet fails the same way                                  → retry once at Haiku
Haiku fails                                                 → stop, report to the user; do not guess
```

`.claude/commands/*.md` prompts that delegate via the Agent tool carry this instruction explicitly:
on a rate-limit/overload/5xx-style failure, or the agent reporting it ran out of context/budget,
retry once at the next tier down and say so ("retrying at Sonnet after Opus was rate-limited").
Never silently downgrade without noting it. Do not fall back on a *correctness* failure (the agent
ran fine but produced a wrong answer) — a smaller model won't fix wrong reasoning.

For a hard, environment-wide clamp (e.g. a tight budget period on a shared/constrained machine),
Claude Code supports forcing every subagent to one model regardless of its own `model:` frontmatter:

```json
{ "env": { "CLAUDE_CODE_SUBAGENT_MODEL": "haiku", "CLAUDE_CODE_SUBAGENT_MODEL_FORCE": "1" } }
```

Set this in `.claude/settings.local.json` (machine-local, not committed) when you need it, not as a
permanent repo default — it overrides every agent's judgment-appropriate tier, so it trades quality
for a hard ceiling and should be temporary.

## Why there are exactly 5 project subagents (not more)

Anthropic's measurements put the fixed overhead of spawning a subagent at roughly 20–30k tokens of
context before it produces anything useful, separate from whatever work it then does. "Spawn for
independence, not for tidiness" — a subagent earns that cost when you need something a shared
context can't give you: an opinion formed without seeing your reasoning (review), genuine
wall-clock parallelism, or isolating verbose output (build logs, curl dumps) so only a summary
returns to the main conversation.

That's why `/clarify`, `/analyze`, and `/constitution` (below) run **inline in the main session**
instead of as dedicated subagents: they're small, sequential, and benefit from sharing context with
whatever came before — spawning a fresh ~25k-token context for a task that's reading two small
markdown files would cost more than it saves. The 5 agents that do exist each have a concrete
reason for isolation:

- `spec-author` / `tech-planner` — benefit from *not* inheriting the main session's framing, so
  ambiguity gets flagged instead of rationalized away.
- `engine-code-reviewer` — the whole point is a second, independent pass.
- `video-pipeline-engineer` — genuinely deep domain knowledge worth keeping out of the main
  context until a video bug actually needs it.
- `deploy-verifier` — isolates a chatty `curl`/build-log operation so only pass/fail returns, on
  the cheapest model that can do it.

Keep agent `description:` fields to one or two sentences — Anthropic warns combined subagent
descriptions have a ~15,000-token budget across a session, and the description is the part that's
always loaded (to decide *whether* to delegate); put detail in the agent's body instead, which only
loads when that agent actually runs.

## Prefer CLI/scripts over MCP servers for one-off work

A registered MCP server adds its name and instructions to every session's context even before any
tool is called (tool *schemas* are deferred until first use, but the server's presence isn't free).
A CLI tool invoked through Bash — `gh`, `curl`, or a disposable Node script — adds nothing until you
actually run it. Every browser verification done in this project so far (export output, UI
regressions, CSS stacking bugs) used a throwaway Playwright script run via `node /tmp/....mjs`, not
a persistent MCP server, and that pattern is the right default for anything you already know how to
automate. Add a personal/local MCP server (e.g. `claude mcp add`) if you want interactive, stateful
browser control across many turns instead — a reasonable tradeoff for *that* use case, just not
something this repo should force on every session by default.

**The one exception is Apify** (`.mcp.json`, inert until `APIFY_TOKEN` is set — see
[docs/RESEARCH_TOOLING.md](RESEARCH_TOOLING.md)). It earns a registered server because its value is
*dynamic discovery* across a catalog of thousands of scraper Actors neither of us can hardcode in
advance — a static script only works when you already know exactly what to call, which doesn't hold
for "find whatever Actor can scrape this specific site." Don't use this exception to justify
registering a server for something a script could already do.

GitHub and Vercel access come from Claude Code's connected plugins/CLI (`gh`, `vercel`), not from a
committed MCP config — never hardcode a token into a project file.

## Truncate verbose output before it hits context

`npm run build`, `curl -sI`, `ffprobe -show_streams -of json`, and browser console dumps can all be
hundreds of lines where only a handful matter. Pipe through `tail`, `grep`, or `jq` at the point you
run the command, not after reading the full output:

```bash
npm run build 2>&1 | tail -15
curl -sI "$url" | grep -i "age\|last-modified\|x-vercel-cache"
```

This is not a style preference — it's the same effect as Anthropic's documented pattern of a
`PreToolUse` hook that trims command output before Claude ever sees it, just applied by hand at the
call site instead of via a hook. `deploy-verifier`'s whole job is doing exactly this for deploy
checks so the main session never has to.

## Prompt-cache awareness

Claude Code's prompt cache has a short TTL (minutes, not hours). Batch related work inside that
window — run the build, the check, and the fix in the same stretch rather than spacing them out —
so each step hits a warm cache instead of reprocessing the full context cold. A long idle gap mid-task
(waiting on a human, a slow external process) is the one case where that's unavoidable; don't add
artificial delay otherwise. Anthropic measured batched subagent spawns (within ~5 minutes of a prior
one) hitting warm cache 83%+ of the time, versus a much higher cost for a cold spawn.

## Self-monitoring

Run `/usage` to see per-session token spend and cache hit rate, and `/context` to see what's
currently consuming your context window. If `/usage` suggests trimming a specific file's token
cost, that's a direct, measured signal — act on it before assuming this document's guidance alone
is sufficient.

## Scaling with an explicit token/cost budget

If the user gives an explicit budget ("+500k tokens" or similar) for a larger run, that's a signal
to use the `Workflow` tool's `budget` object (loop-until-budget, or scaling fleet size to
`budget.total`) rather than hand-picking model tiers per call. Workflows are opt-in (the user must
ask for multi-agent orchestration in their own words, or use ultracode) — don't reach for one by
default for normal feature work on this repo.
