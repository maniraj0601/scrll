# Spec: Editor engine (imperative DOM + canvas)

Status: shipped (baseline — documents existing behavior, not a build target)
Owner: core app

This is a **baseline spec**: it exists so an AI agent (or a human) can read one file and understand
what the editor guarantees, instead of re-deriving it from `engine.js` through many exploratory
reads. It complements `docs/ARCHITECTURE.md` (the "how") by stating the "what must stay true" as
testable requirements. There is no `plan.md`/`tasks.md` for this folder — nothing to build, it's
already shipped. When a future spec changes this subsystem, it should update this file's
requirements, not just the code.

## Problem

A carousel/collage editor needs real-time, direct-manipulation editing (drag, resize, rotate, snap,
draw) that feels native — which React's declarative reconciliation isn't built for at 60fps pointer
granularity — while still producing pixel-accurate exportable output.

## Goal

- Direct-manipulation editing of photos, videos, text, shapes, and freehand drawing across multiple
  slides, with undo/redo, that matches exactly what gets exported.

## Non-goals

- This spec does not cover video recording/encoding (see `specs/002-video-export-pipeline`) or
  draft storage (see `specs/003-persistence-and-drafts`) beyond where the engine touches them.

## Requirements

1. The editor's editing surface (`src/editor/engine.js` + `markup.js`) is imperative DOM/canvas
   code mounted by React (`Editor.jsx`), not a React component tree. React and the engine never
   mutate the same subtree.
2. `mountEditor(container, options)` returns a disposer; every listener/timer/media/stream it
   creates is released through it or at the correct narrower lifetime (drag end, export
   cancellation).
3. Slides form one horizontal document; slide `i` starts at document x = `i * W`. All element
   geometry (`x`, `y`, `w`, `h`) is in document units, never screen pixels. Any interaction code
   that reads `clientX`/`clientY` converts through the current zoom (`z`) before comparing to
   document-space geometry or thresholds.
4. A continuous drag/resize/rotate gesture updates live geometry every pointer move but creates
   exactly one undo entry, committed at the gesture's end — not one entry per pointer-move event.
5. Movement snapping and resize snapping are independent paths with screen-pixel-based thresholds
   (acquire at `8/z`, release at `18/z`) so the felt snap distance stays constant regardless of
   zoom. Alt/Meta bypass snapping. Corner resize preserves aspect ratio and the opposite corner;
   side resize preserves the opposite edge.
6. An element with `type: 'img'` may be a photo or a video; only `IMG.get(e.k)?.type` distinguishes
   them — the element's own `type` field never does. `speed` (video playback rate, 0.25x–4x,
   missing = 1x) and `s` (crop zoom) are different fields and must never be conflated.
7. Every visual feature that changes how a layer looks needs parity across **both** render paths
   that can draw it: the live DOM editor (`paint()`) and the canvas renderer (`drawEl`/`draw`) —
   and a **third** path, video export (`specs/002-video-export-pipeline`), if the layer can be a
   video. Shipping a change to only one path when the layer type requires more is a parity bug even
   if the live editor looks correct.
8. A CSS border/outline on a layer's container must remain visible when that layer is a playing
   `<video>` — a plain CSS `outline` can be painted over by the video's own compositing layer in
   some browsers; the border must be implemented as a sibling overlay element, not a parent outline,
   specifically because of this.
9. Drawing (freehand ink) and photo-erasing share one brush cursor; their pointer handlers must not
   hide or overwrite each other's cursor state while the other mode is active.
10. A video element that is shorter than its slide's display duration loops by seeking back to its
    start; that seek must never block the render of other layers on the same frame (no synchronous
    `await` of a seek inside a shared per-frame tick).

## Constraints from the constitution

- `AGENTS.md`: "Do not let React and the engine mutate the same subtree," coordinate-space check,
  commit-at-gesture-boundary, video `type:'img'` + `speed`/`s` semantics, draft-playback-export
  consistency.
- `docs/ARCHITECTURE.md` "State and rendering lifecycle" and "Editor model and coordinates"
  sections are the implementation-level detail behind requirements 3–7 above.

## Out of scope / explicitly deferred

- Multi-user/collaborative editing, undo/redo across sessions, and any server-authoritative state —
  this app has no backend (see `specs/003-persistence-and-drafts`).
