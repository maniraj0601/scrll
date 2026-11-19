# Spec: Video export pipeline

Status: shipped (baseline — documents existing behavior, not a build target)
Owner: core app

Baseline spec — see `specs/001-editor-engine/spec.md`'s header note for what that means. This one
exists because this subsystem has the highest bug density and the most hard-won, easy-to-forget
lessons in the repo (real encoder failures, real frame-pacing bugs, all found and fixed by actually
decoding output, not by reading code). `docs/ARCHITECTURE.md`'s "Media and export pipeline" section
has the structural detail; `.claude/agents/video-pipeline-engineer.md` has the debugging playbook.
Read this one for the behavior contract.

## Problem

Exported carousels must include video — with the actual layout, trims, speed changes, and audio —
not just a still frame, and the download must be a format the user can actually use (MP4 for
Instagram/general compatibility) without the user needing to know anything about codecs.

## Goal

- A selected slide containing video exports as a single MP4 file reproducing that slide's full
  layout, trim, speed, and mixed audio, downloaded directly (no ZIP).
- Export never silently degrades: it either produces a correct file or fails with a clear reason.

## Non-goals

- Frame-exact, offline, non-real-time encoding. This is explicitly a real-time capture of the live
  canvas, bound by what the device can composite/encode as it happens — not a guarantee of
  perfectly smooth output on every device.
- Lossless video. Video is always re-encoded; only PNG stills are lossless.

## Requirements

1. `recordSlide()`/`recordAttempt()` create separate media elements per video layer (not reusing
   editor playback as the export clock), apply each layer's trim (`vs`/`ve`, source seconds) and
   `speed`, and mix audio through Web Audio with per-layer gain to reduce clipping.
2. Slide duration is the longest speed-adjusted clip on that slide (`(ve - vs) / speed`); shorter
   clips loop by seeking back to their trim start without blocking the render of other layers (see
   `specs/001-editor-engine` requirement 10).
3. A muted layer (`e.mute`) contributes true silence to the mixed export audio, not just a lowered
   level; unmuted layers' gain is rebalanced so muting one doesn't quietly change the others'
   perceived volume ratio.
4. The frame-capture loop paces itself off a fixed time grid (`start + tick * step`), not "now +
   step" after each render — a slow frame (e.g. compositing 4K source video) must not add the full
   tick interval *on top of* its own cost, or effective frame rate collapses well below what the
   device can actually sustain.
5. Canvas capture pushes a frame right after each real `render()` call (manual `captureStream(0)` +
   `track.requestFrame()`) rather than relying on the browser's own fixed-interval auto-sampling,
   so the encoder never receives a stale duplicate frame while rendering is behind.
6. Target recording is 30fps, even output dimensions, at most 3840px on the longest side, with a
   live-capture bitrate sized for what a software encoder can sustain in real time — not sized for
   final delivery quality, since the WebM is only an intermediate.
7. Downloads are always MP4. If the browser can record MP4 directly, that's used; otherwise WebM is
   recorded as an intermediate and converted locally via `mediabunny` (WebCodecs) to H.264 video +
   AAC audio at the same resolution.
8. If the device's H.264 encoder can't handle the requested resolution's macroblock count, the
   resolution is stepped down via a scale ladder until the device confirms it can encode it — export
   must not simply fail at "Maximum" size on a device with a lower real ceiling.
9. If the browser has H.264 video encoding but not native AAC audio encoding, a WASM AAC encoder
   fallback (`@mediabunny/aac-encoder`) is loaded lazily and used — audio must never be silently
   dropped because of this specific, known browser gap.
10. Conversion failure is never silent: a track mediabunny had to discard, or an unsupported
    encode, surfaces a clear error naming the reason. The app never renames a WebM to `.mp4` or
    downloads a WebM pretending to be the requested format.
11. Encoder construction/start failures retry other supported codec configurations at the same
    resolution; cancellation, hidden-tab, and source-decode errors do not retry. Export requires the
    tab stay visible; backgrounding it fails clearly rather than silently exporting a throttled
    recording.
12. Cancelling an export (including mid-MP4-conversion) releases all media/streams/AudioContext
    resources and produces no partial download. Retrying immediately after a cancel must not visibly
    glitch the UI (e.g. a progress-fill animation colliding with the previous run's teardown
    animation).
13. `@fix-webm-duration/fix` repairs only WebM header metadata (duration/seeking), never rewrites
    unknown-sized media clusters.

## Constraints from the constitution

- `AGENTS.md`/`docs/DEVELOPMENT.md`: "never claim lossless video export or invent a codec
  unsupported by `MediaRecorder`"; verify actual downloaded media (decode, seek, duration, audio),
  never just the filename or a success message.
- `.claude/agents/video-pipeline-engineer.md`: verification must use a real repro in a real headless
  browser against `npm run dev` (not `vite preview` — dev serves raw ES modules for direct import),
  decoding actual output, before calling any fix done.

## Out of scope / explicitly deferred

- Server-side/worker-based encoding, frame-stepped deterministic export decoupled from real-time
  Web Audio capture — considered and rejected as a much larger rearchitecture than any specific bug
  fix has justified so far.
