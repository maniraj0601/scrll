# Plan: <feature name>

Reads: `spec.md` in this folder, `AGENTS.md`, the relevant `docs/` section.

## Approach

One paragraph: the shape of the solution and why this approach over the obvious alternatives, if
there were any worth naming.

## Affected files

| File | Change |
| --- | --- |
| `src/editor/...` | ... |

Name the actual owning module per `AGENTS.md`'s architecture boundaries and the
editor-development skill's routing table — don't guess which layer owns a behavior.

## Data model impact

New/changed persisted fields (document elements, project/doc shape, IndexedDB stores). For every
new field: what old drafts without it should do (a default, not a crash or silent corruption) —
see `AGENTS.md`'s draft-compatibility rule.

If none: say "None — no persisted shape changes."

## Rendering/export parity

If this touches anything drawn or exported: how does it stay consistent across the DOM-based live
editor (`paint()`), the canvas renderer (`drawEl`/`draw`), and video export (`videoRenderer`,
`video-export.js`)? Flag any of the three that this plan does NOT update, if genuinely not needed.

If not applicable: say "None — this doesn't touch rendering or export."

## Risks / what could break

Concrete regressions this could cause and the existing behavior they'd break, not generic
"could introduce bugs." Reference the QA matrix row(s) in `docs/DEVELOPMENT.md#validation` that
cover them.

## Open questions

Anything `spec.md` marked `[NEEDS CLARIFICATION]` that blocks writing tasks, plus any new ones this
plan surfaced. Resolve these before moving to `tasks.md`.
