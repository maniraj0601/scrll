---
description: Propose an update to the project's constitution (AGENTS.md / docs/ARCHITECTURE.md) after a shipped change establishes a new durable invariant
---

This repo's constitution already exists — `AGENTS.md` plus `docs/ARCHITECTURE.md`,
`docs/DESIGN_PRINCIPLES.md`, and `docs/DEVELOPMENT.md` — unlike a greenfield project where this
stage bootstraps one from nothing. This command's job here is narrower: **propose an update**,
never a rewrite.

What changed that might need a constitution update: $ARGUMENTS (e.g. a just-shipped
`specs/NNN-slug/`, or a describe-it-yourself change).

Run this **inline, not as a subagent** — it's a judgment call best made with full session context
about what actually shipped, not a research task.

1. Read `AGENTS.md` in full.
2. Decide whether the change actually introduced a new *durable invariant* — something future specs
   and implementations must keep respecting (a new coordinate convention, a new persisted-field
   default rule, a new render-parity requirement) — versus just a one-off feature detail that
   doesn't generalize. Most shipped features need no constitution update; say so if that's the
   case.
3. If it does, propose the smallest edit to the right file (`AGENTS.md` for a change rule or
   boundary, `docs/ARCHITECTURE.md` for a structural fact, `docs/DESIGN_PRINCIPLES.md` for a UX
   default) — state the exact new line(s), don't restructure the surrounding document.
4. Check the edit keeps `AGENTS.md` within its ~200-line budget (see
   `docs/AGENT_MODEL_ROUTING.md`) — if adding a rule would blow past it, the detail probably belongs
   in a skill or a `docs/` file instead, with just a pointer added to `AGENTS.md`.
5. Show the user the proposed edit before applying it — this file is read by every session and
   every agent, so a wrong addition here has an outsized, repo-wide cost.
