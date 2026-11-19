---
description: Turn a plan.md into specs/NNN-slug/tasks.md (stage 3 of the spec-driven workflow)
---

Target spec folder or feature slug: $ARGUMENTS (if omitted, find the most recently modified
`specs/NNN-*/plan.md` that doesn't yet have a `tasks.md` next to it).

This stage is mechanical enough to do directly (no subagent needed — see
`docs/AGENT_MODEL_ROUTING.md`: a well-written plan has already resolved the ambiguity, so turning it
into an ordered checklist is Tier 1/2 work, not worth a dedicated delegation).

Read the target `spec.md` and `plan.md` in full. Write `tasks.md` in the same folder following
`specs/_template/tasks.md`'s structure: small, independently verifiable steps in dependency order,
each naming its owning file(s) and a concrete, checkable done-condition (a behavior, not "code
compiles"). Include the verification-pass and ship checklists from the template, trimmed to what
this specific feature actually needs (don't include a drafts-compatibility check if the plan said
there's no data model impact).

Report the tasks file's path and a one-line summary of how many tasks and what the riskiest one is.
Tell the user it's ready for `/implement`.
