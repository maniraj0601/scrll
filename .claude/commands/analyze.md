---
description: Read-only cross-check of spec.md/plan.md/tasks.md for conflicts, gaps, and ambiguity before implementing (stage 3.5 of the spec-driven workflow)
---

Target spec folder or feature slug: $ARGUMENTS (if omitted, use the most recently modified
`specs/NNN-*/` folder that has all three of `spec.md`, `plan.md`, and `tasks.md`).

Run this **inline, not as a subagent** — reading three already-small files you likely just wrote
doesn't need an isolated context; see `docs/AGENT_MODEL_ROUTING.md`'s "spawn for independence, not
tidiness" rule. This step is read-only: it never edits any file, only reports.

Read all three files together and check for:

1. **Coverage gaps** — a requirement in `spec.md` with no corresponding task in `tasks.md`.
2. **Orphaned tasks** — a task in `tasks.md` that doesn't trace back to any requirement or plan
   item (scope creep that snuck in after planning).
3. **Contradictions** — `plan.md` taking an approach that conflicts with a requirement, or two
   requirements that can't both hold.
4. **Unresolved ambiguity** — any `[NEEDS CLARIFICATION]` marker that survived past `/clarify`, or
   a plan-level open question never answered.
5. **Constitution drift** — anything in the plan or tasks that would violate `AGENTS.md`'s change
   rules or architecture boundaries (re-check this even if `tech-planner` already did; a human or
   another session may have edited the plan since).

Report findings as a short list: file, what's wrong, and which of the five categories above. If
nothing's wrong, say so plainly. Do not fix anything yourself — tell the user what to fix, in which
file (spec, plan, or tasks), before running `/implement`.
