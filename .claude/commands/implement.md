---
description: Work a spec's tasks.md checklist (stage 4 of the spec-driven workflow), routing each task to the right subagent and model tier
---

Target spec folder or feature slug: $ARGUMENTS (if omitted, find the most recently modified
`specs/NNN-*/tasks.md` with unchecked boxes).

If `/analyze` hasn't been run against this folder yet (or the artifacts changed since it last ran),
run it first — catching a spec/plan/tasks contradiction now is far cheaper than discovering it
mid-implementation.

Read `spec.md`, `plan.md`, and `tasks.md` in the target folder, plus `AGENTS.md`. Work the checklist
top to bottom (respecting any noted dependencies). For each task, pick the delegate by what it
touches — don't default everything to one agent or do everything inline yourself:

| Task touches | Delegate to | Model |
| --- | --- | --- |
| `src/editor/video-export.js`, video-specific parts of `engine.js` | `video-pipeline-engineer` | Sonnet |
| `src/editor/engine.js`/`markup.js`/`editor.css` UI simplification | `editor-ui-simplifier` | Sonnet |
| Competitive UI/UX research, `docs/UI_UX_RESEARCH.md`/`DESIGN_PRINCIPLES.md` | `ux-competitor-research` | Sonnet |
| Anything else in `src/editor/` with no closer match | Direct implementation (you), following `.github/skills/editor-development/SKILL.md` | — |
| React Home/Explore/Library components, `src/lib/`, `src/catalog/` | Direct implementation (you) | — |
| Mechanical/deterministic steps (e.g. updating a changelog line, a config value) | Direct implementation (you) — not worth a delegation | — |

After any task that changed `src/editor/engine.js`, `markup.js`, `video-export.js`, `clip-trim.js`,
or `editor.css`, run the `engine-code-reviewer` subagent (Sonnet) on the diff before checking the
task's box. Fix anything it flags as a real invariant violation before moving on; use judgment on
stylistic nits.

**Fallback on infrastructure failures only** (rate-limit, overload, context exhaustion — not wrong
output): retry once at the next tier down per `docs/AGENT_MODEL_ROUTING.md`'s ladder, and say so.
Never fall back because an agent produced a wrong answer — fix the prompt or do it directly instead.

Check a task's box only after its done-condition is actually verified, not when the code is
written — per `tasks.md`'s own instruction and `AGENTS.md`'s verification standard (a build passing
is not proof of correct behavior; for media/export changes, inspect the actual decoded output).

Commit only if asked. When every task is checked, report what shipped, what was verified and how,
and anything still unverified (e.g. a real-device codec path that can't be checked in this
environment).
