---
description: Turn a feature idea into specs/NNN-slug/spec.md (stage 1 of the spec-driven workflow)
---

Read `specs/README.md` if you haven't this session. The feature/bug request to turn into a spec is:

$ARGUMENTS

Delegate this to the `spec-author` subagent (Opus — this is the highest-judgment step in the
pipeline) via the Agent tool, running in the foreground since its output gates the next step. Pass
it the request verbatim plus enough context from the current conversation that it doesn't have to
re-ask what's already been discussed.

If the Agent call fails with a rate-limit/overload error or the agent reports it ran out of context
before finishing, retry once with `model: "sonnet"` and say so explicitly before reporting the
result — see `docs/AGENT_MODEL_ROUTING.md`'s fallback ladder.

When it returns:
1. Show the spec's path and a brief summary (problem, goal, top requirements).
2. If it left any `[NEEDS CLARIFICATION: ...]` markers, run `/clarify` next (or do the same thing
   inline) — do not resolve them yourself by guessing and do not silently proceed to `/plan` while
   they remain open.
3. Otherwise, tell the user the spec is ready for `/plan`.
