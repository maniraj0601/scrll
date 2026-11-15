# Development guide

## Setup

Use Node.js 22.12+ (or 20.19+) and npm. `package-lock.json` is committed.

```bash
npm ci
npm run dev
```

Use the local URL printed by Vite. For a production-like check:

```bash
npm run build
npm run preview
```

No application environment variables or backend services are required for local editing. Catalog photography and some sticker assets use external URLs; a fresh offline session may not load these assets.

The repository currently has no test runner, linter, formatter, or corresponding npm scripts. Do not invent `npm test` / `npm run lint` commands. Test files are intentionally not maintained here; keep one-off browser scripts and media fixtures outside the repository.

## Making a change

1. Read [AGENTS.md](../AGENTS.md) and the relevant [architecture section](ARCHITECTURE.md). Inspect the current diff before editing; preserve unrelated changes.
2. Locate the smallest owning module. Home UI usually belongs in React components; editor UI belongs in the engine/inspector helpers. Do not rewrite the entire editor for a local fix.
3. Reproduce the behavior with a small draft. Identify whether the affected path is DOM rendering, canvas rendering, persistence, or more than one.
4. Make the smallest coherent change and keep dependent paths consistent. Use optional persisted fields with defaults for old drafts.
5. Run the build and relevant browser checks below. Inspect console errors and actual outputs, not just successful button clicks.
6. Update documentation if behavior or architectural contracts changed. Describe checks performed and any unsupported browser/device paths.

### UI and interaction standards

- Keep controls compact, hierarchy clear, and context-specific tools near the action.
- Respect safe areas, small viewport heights, touch scrolling, and system/reduced-motion styling.
- A compact visual control still needs a usable touch hit area and visible keyboard focus.
- Preserve pointer capture, pointer cancellation, and keyboard alternatives for drag-only controls.
- Use document coordinates for geometry and screen-space thresholds for perceived snapping behavior.
- Finish one gesture with one history commit. Continuous pointer updates should not create dozens of undo entries.
- Keep Home/editor styles route-scoped through `useStyleSheet`; do not introduce global cross-route CSS leakage.
- Reuse the catalog and existing icon adapters; do not duplicate templates or hardcode another preview renderer without need.

### Dependencies

Prefer existing browser APIs and helpers. If a dependency is necessary, update `package.json`, run `npm install` to update the lockfile, and verify both dev and production resolution. `npm ci` restores a clean locked install.

## Validation

Run `npm run build` for code changes. Documentation-only changes need link/path/content checks, not a production rebuild.

For responsive changes, a useful baseline is 1440 x 1000 desktop and 390 x 844 mobile with touch enabled. Also check a narrow/short viewport when controls might overflow. Browser emulation does not prove real iOS/Safari codec support; report that limitation.

| Changed area | Focused checks |
| --- | --- |
| Navigation / route lifecycle | Home -> editor -> Back repeatedly; browser Back/Forward; direct `/edit?...`; missing draft; no duplicate listeners or CSS leakage |
| Catalog | Card preview and editor match; filters; regular templates versus Explore; unique IDs; valid image/sticker assets |
| Selection / geometry | Click outside deselects; move; every resize direction; rotated elements; zoomed coordinates; multi-select; undo/redo |
| Snapping | Top-aligned media extended to bottom using side AND corner; other edges/centres; acquire/hold/release; aspect ratio; modifier bypass; multiple slides |
| Drawing / eraser | Cursor visible on hover and during stroke; drawing versus photo-erasing modes do not interfere; color/size; undo/redo; export |
| Video trim / speed | Mouse and touch handles; bounds cannot cross; number fields; keyboard arrows/Home/End; Reset; undo/redo; 0.5x and 2x in editor, preview, and export |
| Video playback | Import/startup interruptions; natural loops; paused-clip recovery; all visible videos when zoomed out; cross-slide clips; current trim after undo; preview swipe/targets/exit; hidden-tab resume; editor paused during export and resumed after cancel |
| Persistence | Save, reload, reopen from Home; old draft defaults; duplicate/delete/import; original media available after reopen |
| Image / PDF export | Selected slides only; select/deselect all; direct files; dimensions and composition; PDF page order; video still-frame warning |
| Video export | Mixed image/video slides; trims and speed-adjusted duration; shorter-clip loops; audio and silent source; overlays; cross-slide clips; cancel/retry; background-tab failure |
| Downloaded video validity | Decode and play; seek to a later frame; confirm animation, duration, dimensions, and audio; exercise native MP4 and WebM-to-MP4 recovery; check named and unnamed filenames |

Validate only affected behavior plus coupled regressions, rather than replaying the entire matrix for every change.

### Practical media verification

Use small, generated or licensed fixtures, not private user media. Keep them outside the repo. For example, with FFmpeg installed:

```bash
ffmpeg -f lavfi -i "testsrc2=s=240x240:r=30:d=4" \
  -f lavfi -i "sine=frequency=440:duration=4" \
  -c:v libx264 -pix_fmt yuv420p -c:a aac /tmp/carousel-qa.mp4
```

Use a unique output path if the file already exists. FFmpeg is an optional local validation tool, not an app dependency. Inspect a downloaded output:

```bash
ffprobe -v error -show_streams -show_format -of json /path/to/download.mp4
```

Confirm actual pixel changes at different timestamps and non-silent audio when expected. File extensions and UI success messages alone do not prove a usable export.

## Troubleshooting

### Vite cannot resolve a newly added dependency

Check `npm ls <package>` and the manifest/lockfile first. Install missing locked dependencies if needed. If installed but the already-running dev server still fails, stop and restart that server to clear stale dependency-resolution state. Verify the actual module request, not just the home page.

Do not delete the lockfile or add a source alias to hide an installation/cache problem.

### Home styles or editor controls suddenly change

Check that `styles.css` and `editor.css` are still imported with `?inline` and mounted through `useStyleSheet`. Shared selectors make global imports unsafe.

### A draft appears missing

Check the browser profile and exact origin, including protocol and port. Production domains and localhost have separate IndexedDB stores. Do not clear site data as a first troubleshooting step.

### Canvas export is blank, wrong, or fails

Check media decoding, canvas size, image origin/CORS, font readiness, and parity between `paint()` and `drawEl()`. Reduce export size on memory-constrained devices. Never claim lossless video export or invent a codec unsupported by `MediaRecorder`.

### Video export freezes or cannot seek

Keep the tab visible; inspect codec support and decode errors. Confirm `videoRange()` and `videoSpeed()` agree with preview. For WebM, verify duration metadata and the header-only repair path without rewriting media clusters.

Supported codecs can still fail at runtime. Export retries other supported encoders without silently reducing resolution. If MP4 recording fails, an intermediate WebM is converted locally to H.264/AAC MP4 using the lazy-loaded `mediabunny` module. This requires browser WebCodecs encoding support; unsupported audio/video conversion fails clearly rather than dropping a track or downloading WebM. If all encoders fail, choose a smaller size or another browser. When validating recovery, simulate a recorder error as well as a constructor/start failure; confirm cancel and decode errors do not retry, and cancellation during MP4 conversion releases resources and produces no download.

## Deployment

`vercel.json` and `netlify.toml` configure Vite builds, `dist/`, SPA routing, and basic headers. Vercel also declares immutable caching for hashed assets.

1. Build and verify the affected flow before publishing.
2. Review the diff and ensure `dist/`, `node_modules/`, `.vercel/`, credentials, and QA fixtures are excluded.
3. Deploy only when requested. An authenticated manual Vercel production deploy can use `npx vercel@latest --prod`; confirm the intended linked project/account before running it. Do not assume Git pushes automatically publish.
4. On the deployed URL, verify Home, direct editor links, legacy redirect, asset loading, and the changed behavior.
5. Remember that drafts are origin-local; checking a different deployment hostname will not show drafts from the old hostname.

Do not put account identifiers, access tokens, or machine-specific project linkage in these guides.
