# Architecture

## Runtime map

```text
index.html
  src/main.jsx (React StrictMode, lightweight pathname router)
    /                 -> App.jsx -> reusable Studio components
    /edit             -> lazy Editor.jsx
                           -> useStyleSheet(editor CSS)
                           -> mountEditor(host)
                                engine.js + markup.js
                                clip-trim.js
                                video-export.js

src/catalog/          -> Home previews AND editor document creation
IndexedDB             <- engine writes / projects.js reads and deletes
```

The editor is hosted by React but its editing surface is imperative DOM and canvas code, not a React component tree. `Editor.jsx` defers mounting one task to avoid duplicate initialization during StrictMode's mount/unmount probe. Its cleanup calls the engine disposer.

There is no backend, server rendering, worker-based video encoder, or second HTML editor. `public/` is for static assets; `dist/` is generated.

## Where to work

| Area | Source |
| --- | --- |
| Studio views, navigation, dialogs | `src/App.jsx`, `src/components/` |
| Home styles | `src/styles.css` |
| Routing and links | `src/lib/router.js`, `src/lib/links.js` |
| Route-owned stylesheet lifetime | `src/lib/useStyleSheet.js` |
| Templates, layouts, metadata, trending IDs | `src/catalog/` |
| Draft summaries and deletion | `src/lib/projects.js` |
| Editor mounting and missing-link handling | `src/editor/Editor.jsx` |
| Editor chrome and styles | `src/editor/markup.js`, `src/editor/editor.css` |
| Tools, model, history, persistence, render/export orchestration | `src/editor/engine.js` |
| Trim markup, pointer/keyboard interactions, bounds | `src/editor/clip-trim.js` |
| Video detection, speed, recording, metadata repair | `src/editor/video-export.js` |
| Icon and sticker definitions | `src/editor/icons.js`, `src/editor/stickers.js` |

Home icons use `src/components/Icon.jsx`; editor icons have a separate markup adapter. Follow the existing adapter for the surface being changed.

## Routes and catalog

Home's hash views are `#explore`, `#explore/stickers`, and `#drafts`. Editor links are built in `links.js`:

| Query | Meaning |
| --- | --- |
| `?new=1&ar=4%2F5&n=3` | New portrait project with three slides |
| `?template=id` | Shared carousel template or Explore layout |
| `?sticker=id` | New project with a sticker |
| `?open=projectId` | Open an IndexedDB draft |

Supported creation ratios are `4/5`, `1/1`, and `9/16`; new projects are limited to 20 slides. The engine rewrites newly opened designs to their saved-draft URL. Missing drafts/templates return to Home. `/editor.html` remains a compatibility route and hosting redirect.

`CAROUSELS` and `LAYOUTS` are the source definitions. `catalog/index.js` adds metadata for Home and exposes separate `TEMPLATES`, `EXPLORE`, and hand-picked `TRENDING` shelves. `toDoc()` in the engine converts percentage-based catalog layers into editor coordinates. Changes to layer schemas must account for both `SlidePreview.jsx` and this conversion.

## Editor model and coordinates

The mutable `doc` contains `W`, `H`, `n`, backgrounds (`bg`, optional seamless `mbg`), `els`, and optional project/layout/preview metadata. Creation uses `W = 1080` and heights of 1080, 1350, or 1920.

Slides form one horizontal document. Slide `i` starts at `x = i * W`; element coordinates are document units, not screen pixels. `z` is viewport zoom; pointer deltas must be divided by it. Rotation `r` is in degrees.

Common element fields:

| Fields | Purpose |
| --- | --- |
| `id`, `type` | Stable identity; `img`, `text`, `shape`, or `draw` |
| `x`, `y`, `w`, `h`, `r` | Geometry and rotation |
| `o`, `rd` | Opacity and corner radius |
| `k` | Media-map key, not the original file or a persistent object URL |
| `s`, `ox`, `oy` | Media crop zoom and offsets |
| `vs`, `ve` | Video trim bounds in **source seconds** |
| `speed` | Video playback rate; missing values mean 1x, clamped to 0.25x-4x |
| `lg`, `li` | Optional layout group and slot membership |

Images, videos, and many stickers all use `type: 'img'`. `IMG.get(k).type` distinguishes image/video. `IMG` holds decoded source metadata and original files; `NODES` maps element IDs to rendered DOM.

`SL(e)` determines a slide by element centre for several editor operations. Video export deliberately uses intersecting bounds via `videoLayers()` so clips crossing slide boundaries are detected on both slides — this handles **legacy/imported** documents, not new placement: `clampVideoToSlide()` keeps a video element's move drag within the single slide it started on, since a carousel's swipe boundary can't carry continuous video playback the way it can a bleeding photo. Other element types (`text`, `shape`, `img` with image media) are unaffected and may still span slides.

## State and rendering lifecycle

- `paint()` updates an element's DOM; `place()` positions selection and quick actions.
- `panel()` constructs inspector markup; `sync()` updates controls from the model.
- `act()` dispatches tool actions; `render()` reconciles the full editing scene.
- `commit()` stores a JSON document snapshot, updates history controls, and schedules saving. `undo()` restores a snapshot and rerenders.
- Live drags paint without committing every frame. Their end commits one undoable edit.
- Export uses canvas `draw()` / `drawEl()` / `drawF()`, not DOM screenshots. A new visual feature often needs both DOM and canvas implementations.

Movement snapping and resize snapping have separate paths (`snap`, `snapR`) sharing candidates and guides. Thresholds are screen-pixel based (`8 / z` acquire, `18 / z` release). Corner resizing preserves aspect ratio and the opposite corner; side resizing preserves the opposite edge. Alt/Meta bypass snapping; rotated resize retains its existing non-snapping behavior.

Drawing and photo erasing share a brush cursor. Their pointer handlers must not hide or overwrite each other's cursor while the other mode is active.

## Persistence

IndexedDB database `carousel-studio`, version 1:

| Store | Key / value |
| --- | --- |
| `p` | `id` key path; record containing name, timestamps, slide count, height, preview target, thumbnail, serialized `doc`, and `imgs` manifest |
| `b` | `${projectId}|${imageKey}` -> original media Blob/File |

`saveProj()` writes original media and document metadata. `openProj()` reloads originals through `load()`, recreating decoded media and object URLs. `src/lib/projects.js` reads lightweight summaries and deletes a draft's associated blobs. Draft import copies media and scales imported slides into the destination.

Never persist DOM nodes, canvases, streams, or object URLs as document state. Add optional fields with backward-compatible defaults. A schema migration must update both DB-opening implementations and account for existing projects.

Storage belongs to the browser profile and origin. Domain changes, private browsing, quota limits, and clearing site data affect access. The draft backup/restore implementation is in the engine; do not assume remote synchronization exists.

## Media and export pipeline

The editor and preview share clip trims and `videoSpeed()`. The trim UI displays source start/end times; its selected-duration display accounts for speed:

```text
output clip duration = (trim end - trim start) / playback speed
```

Canvas playback uses visible viewport bounds, not a clip's centre slide; all visible videos play muted and inline. Preview uses `videoLayers()` intersection with the displayed slide, including clips spanning slide boundaries. Both paths use the same playback helper, recover on readiness/seek/pause/end events, and resolve current document elements for trim callbacks after undo. Play requests are deduplicated; interrupted requests are retried, and autoplay permission failures retry on user interaction. Hidden tabs, offscreen clips, and active exports pause playback; returning or cancelling export resumes the appropriate view.

`buildExport()` renders selected slides in order. Downloads are direct files, never ZIP:

| Format | Output |
| --- | --- |
| Auto | Video for slides with visible video; PNG for other slides |
| Video | One composed video per selected slide; still-only slides last five seconds |
| PNG / JPG / WebP | One image per selected slide; video becomes a still |
| PDF | One document containing the selected slides as rasterized pages |

PNG is lossless at the chosen dimensions; it cannot recreate source detail or preserve video motion. Other image formats and PDF flatten onto white. Size choices are constrained by the engine's canvas pixel budget.

For video, `videoRenderer()` caches static layer runs while preserving layer order and blend behavior. `recordSlide()` creates separate media elements, applies trims/speed, mixes audio through Web Audio, and records the canvas using `MediaRecorder`. It does not reuse editor playback as its clock.

- The longest speed-adjusted clip determines slide duration; shorter clips loop.
- Audio is mixed with per-layer gain to reduce clipping; playback requests pitch preservation.
- A silent audio source keeps recording alive for silent or still-only content.
- Downloads are always MP4. Capability detection chooses the preferred recorder; if native MP4 fails, WebM is recorded only as an intermediate and lazily converted by `mediabunny` to H.264 video and AAC audio at the same resolution. Unsupported conversion fails clearly, never returning WebM or silently discarding tracks.
- Capability detection is not a guarantee of successful encoding. Encoder failures retry other supported codec configurations at the same resolution; cancellation, hidden tabs, and source decode errors do not trigger retries. Recovery reserves the final 15% of progress for MP4 conversion and supports cancellation during conversion.
- Target: 30 fps, even dimensions, at most 3840 px on the longest side, adaptive high bitrate. Actual smoothness and codec support depend on the device.
- Video is re-encoded in real time, not lossless or frame-exact offline rendering. The tab must stay visible; hiding it fails clearly rather than silently exporting a throttled recording.
- Abort, decode, and encoding failures clean up media/streams; the caller closes its AudioContext.
- `@fix-webm-duration/fix` is lazy-loaded only for WebM metadata repair. The header-only path avoids rewriting unknown-sized media clusters; keep duration and seeking checks when changing it.

Export uses the same sheet from the editor and preview. Preserve progress, cancellation, selection, and multiple direct-download behavior when extending formats.

Export filenames use the slugged project name when provided. Empty names and the default `Untitled carousel`/`Untitled` use `slide-01`, `slide-02`, etc., or `carousel.pdf`; do not change stored draft names merely to format downloads.
