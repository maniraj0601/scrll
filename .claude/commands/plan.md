---
description: Turn a spec.md into specs/NNN-slug/plan.md (stage 2 of the spec-driven workflow)
---

Target spec folder or feature slug: $ARGUMENTS (if omitted, find the most recently modified
`specs/NNN-*/spec.md` that doesn't yet have a `plan.md` next to it, and confirm that's the right one
before proceeding).

Read the target `spec.md` in full first yourself, specifically checking for unresolved
`[NEEDS CLARIFICATION: ...]` markers. If any remain, stop and surface them to the user via
AskUserQuestion — do not hand an under-specified spec to the planner, since it will either stall or
silently guess.

Once the spec is clear, delegate to the `tech-planner` subagent (Sonnet — this is normal technical
judgment, not the open-ended ambiguity `spec-author` resolves) via the Agent tool in the foreground.

If the call fails on a rate-limit/overload/context-exhaustion error, retry once with
`model: "haiku"` only if the plan is genuinely mechanical (a small, well-scoped spec); for anything
architecturally non-trivial, surface the failure instead of downgrading — see
`docs/AGENT_MODEL_ROUTING.md`.

When it returns, show the plan's path, the affected-files table, and any open questions it
surfaced. Tell the user it's ready for `/tasks` once open questions are resolved.
