---
name: editor-development
description: Implement and verify Carousel Studio editor features involving canvas geometry, media, trimming, playback speed, drawing, persistence, or export. Use for changes under src/editor and tightly coupled Studio/editor integration.
---

# Editor development

## Goal

Deliver a focused editor change without breaking desktop/mobile interactions, old drafts, preview, or downloaded output. This skill is a reusable repository workflow, not an instruction to rewrite the engine or add tooling.

## Context to load

Read [repository instructions](../../../AGENTS.md), [architecture](../../../docs/ARCHITECTURE.md), and the relevant [validation rows](../../../docs/DEVELOPMENT.md#validation). Then read only the source owning the requested behavior.

| Task | Start with |
| --- | --- |
| Tool / selection / snapping | `src/editor/engine.js`: `act`, pointer handlers, `snap`, `snapR`, `place` |
| Inspector UI | `engine.js`: `panel`, `sync`; `editor.css` |
| Trim and rate | `clip-trim.js`; engine input dispatch; `video-export.js`: `videoSpeed`, `videoRange` |
| Export | `engine.js`: `drawEl`, `draw`, `videoRenderer`, `buildExport`, `exportSelection`; `video-export.js` |
| Drafts | Engine save/open/import functions; `src/lib/projects.js` |
| Lifecycle / navigation | `Editor.jsx`, `main.jsx`, `router.js`, `useStyleSheet.js` |

## Procedure

1. Inspect worktree changes and reproduce the request with a minimal draft. State the expected outcome and which existing behavior must remain intact.
2. Trace the relevant data flow end to end. For media this includes inspector -> persisted element -> editor playback -> preview -> export; a control-only change is not enough if behavior changes.
3. Make surgical changes using existing hooks. Add helpers only where they remove actual duplication or isolate a clear responsibility.
4. Keep these invariants:
   - React owns the editor host; the engine owns its descendants.
   - Pointer deltas use document units; interaction thresholds account for viewport zoom.
   - Commit at gesture boundaries, with undo restoring both controls and rendering.
   - `img` elements may contain videos; `speed` is playback rate, while `s` is crop zoom.
   - Trim bounds stay in source seconds. Output duration divides by playback speed.
   - Old drafts remain valid; no runtime media objects are serialized.
   - Preview and export reflect the actual layout, including transforms, effects, and layer order.
   - New listeners/resources have cleanup; video export supports cancellation and releases streams/media.
5. Validate with `npm run build` and targeted browser checks on desktop and touch/mobile. There is no committed test suite or lint script; keep temporary verification artifacts outside the repo.
6. For media export, inspect actual downloads: decode, animation, audio, dimensions, duration, and seeking. Check format detection and fallback honestly; never rename WebM to MP4.
7. Remove temporary artifacts, review the final diff, and summarize the change, verification, and limitations. Do not commit or deploy without a request.

## Completion evidence

Report the reproduced issue or new behavior, the owning files changed, the commands/browser paths checked, and any unverified device support. A build passing alone is not proof of correct pointer interaction or playable video.
