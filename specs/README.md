# Spec-driven development

This repo builds new features through specs, not ad hoc prompts. A spec is the source of truth;
code is its implementation. This works with any AI tool (Claude Code, Copilot, Cursor, a plain
chat model) or no tool at all — it's plain markdown, not a Claude-specific format.

## Start here if you're an AI agent new to this repo

Read the baseline specs below *before* grepping around the codebase cold — each one is a tight,
testable summary of what a whole subsystem guarantees, written so reading it once replaces many
exploratory file reads. This is also why they exist: `docs/ARCHITECTURE.md` explains *how* things
are built; these specs state *what must stay true*, in the same testable-requirement format every
new spec uses.

| Spec | Subsystem |
| --- | --- |
| [001-editor-engine](001-editor-engine/spec.md) | Imperative DOM+canvas editing surface, coordinates, render parity |
| [002-video-export-pipeline](002-video-export-pipeline/spec.md) | Recording, encoding, MP4 recovery — the highest bug-density area |
| [003-persistence-and-drafts](003-persistence-and-drafts/spec.md) | IndexedDB drafts, draft compatibility |
| [004-home-catalog-explore](004-home-catalog-explore/spec.md) | React SPA, routing, catalog, Explore |
| [005-deployment-and-pwa](005-deployment-and-pwa/spec.md) | Build, hosting, PWA/offline shell |

These are marked `Status: shipped` and have no `plan.md`/`tasks.md` — they document existing
behavior, not a build target. `001`–`005` are reserved for these; the next *new* feature starts at
`006`. When a change to one of these subsystems ships, update the relevant baseline spec's
requirements, not just the code — otherwise it goes stale and starts costing more tokens than it
saves (a wrong summary sends an agent down the wrong path, worse than no summary).

## The constitution

[AGENTS.md](../AGENTS.md) and `docs/` (`ARCHITECTURE.md`, `DESIGN_PRINCIPLES.md`, `DEVELOPMENT.md`)
are the standing rules every spec and plan must obey — coordinate systems, draft compatibility,
the no-test-framework rule, UI invariants, and so on. A spec never repeats them; it references them
and calls out anything it specifically touches or risks. `/constitution` proposes updates to these
when a shipped feature establishes a new durable invariant — it's an update mechanism, not a
from-scratch bootstrap (this repo already has a mature constitution).

## The flow for a new feature

```
idea → spec.md → [clarify] → plan.md → [analyze] → tasks.md → implementation → verify → ship
```

1. **Spec** (`specs/NNN-slug/spec.md`) — what to build and why, in user-observable terms. No
   implementation detail. Mark anything genuinely ambiguous with `[NEEDS CLARIFICATION: ...]`
   instead of guessing — a spec with silently-guessed requirements is worse than one with visible
   gaps.
2. **Clarify** (optional but recommended if step 1 left markers) — resolve every
   `[NEEDS CLARIFICATION]` with the user directly before planning around a guess.
3. **Plan** (`specs/NNN-slug/plan.md`) — the technical approach: which files/modules own the
   change, data model/persistence impact, how it fits the existing render pipeline
   (DOM-editor/canvas-export/video-export parity — see `001-editor-engine`), and what could break.
4. **Analyze** (optional but recommended) — a read-only cross-check of spec/plan/tasks for
   coverage gaps, contradictions, and constitution drift, before any code changes.
5. **Tasks** (`specs/NNN-slug/tasks.md`) — a checklist of small, independently verifiable steps in
   dependency order. Each task names its owning file(s) and its done-condition.
6. **Implement** — work the checklist, committing at natural boundaries, checking items off as
   they land. Follow `AGENTS.md`'s change rules (small focused diffs, no unrelated refactors).
7. **Verify** — reproduce the behavior for real (see `docs/DEVELOPMENT.md#validation`). A build
   passing is not verification; for media/export changes, inspect the actual decoded output.
8. **Ship** — commit, and deploy/verify only when asked (see `docs/DEVELOPMENT.md#deployment`,
   `docs/AGENT_MODEL_ROUTING.md` for the cheap `deploy-verifier` check).

## Using it with Claude Code

`.claude/commands/` has one slash command per stage — `/specify`, `/clarify`, `/plan`, `/analyze`,
`/tasks`, `/implement`, `/verify-deploy`, plus `/constitution` for updating the constitution itself
— each delegating to the right subagent (or running inline, when a dedicated subagent would cost
more than it saves) at the right model tier. See
[docs/AGENT_MODEL_ROUTING.md](../docs/AGENT_MODEL_ROUTING.md) for which is which and why, plus how
this setup keeps token/cost usage down on any machine. `.github/skills/spec-driven-development/`
documents the same procedure for tools that read `.github/skills/` instead (e.g. Copilot) or for
working through it by hand.

## Using it without any tooling

Copy `specs/_template/` to `specs/NNN-your-feature/`, fill in `spec.md`, then `plan.md`, then
`tasks.md`, in order — each one is written by reading the previous one plus the constitution, not
from scratch. The templates list exactly what each file needs.

## Numbering

`NNN` is a zero-padded sequence number so spec folders sort chronologically. `001`–`005` are the
reserved baseline specs above; the next new feature is `006`, then `007`, and so on. Don't reuse or
renumber old ones.

## When to skip this

A one-line copy fix, a config tweak, or a bug fix that doesn't change behavior doesn't need a spec
folder — just fix it per `AGENTS.md`. Specs are for anything that adds or changes user-facing
behavior, touches the data model, or is big enough that "what are we actually building" benefits
from being written down before code.
