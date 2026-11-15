# UI/UX competitive research (Nov 2026)

Reference document for product and UI decisions in Carousel Studio. Written for both humans and AI
coding agents: load this before proposing editor UI changes, new tools, or AI features. Short,
actionable rules distilled from this research live in [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md) —
read that first if you just need the "what to do," and come back here for the "why."

**Confidence:** findings are tagged by source quality. Claims marked *(single-source)* or
*(unverified)* should be re-checked before being used to justify a specific implementation detail.

## Premise correction (important)

The research brief for this document assumed Instagram's Edits app shipped a "Carousel view" that
redesigned how you navigate between clips while editing a single video. That is not what happened.
What shipped (Oct–Nov 2026) is a **Carousel editor**: a new *post format* for building multi-slide
photo/video posts natively inside Edits, replacing a workflow where creators built carousels in
Canva and re-imported them. This is directly relevant to us — it's a competitor shipping the same
product category we're in (multi-slide/carousel creation), not a navigation redesign. The "cleaner
than CapCut" praise in press coverage is real but describes Edits' general editing aesthetic, not a
feature literally named "Carousel view." See [§1](#1-instagram-edits--carousel-editor-oct–nov-2026).

## 1. Instagram Edits — Carousel editor (Oct–Nov 2026)

- Flow: Edits → Projects → "+" → Carousel → pick photos/videos → arrange on a shared canvas with
  layout/spacing presets, cutout-to-sticker tool, filters, color grading, scale/rotate — reusing the
  same toolset as single-clip editing rather than a separate UI.
- Slide management: add blank slides, duplicate, reorder, insert on either side. Carousels can be
  reordered **after publishing** without losing accrued engagement.
- Cross-slide continuity: a photo can visually bleed across adjacent slides, and one headline can
  span multiple slides — the swipe gesture becomes part of the storytelling *(moderate confidence)*.
- Publish directly to Instagram or export — collapses the separate export/re-upload step a
  Canva-then-Instagram workflow required.
- **Comparative review** (Pretty Little Marketer): Edits is "clean, minimal and simple," with a
  monochrome UI that inverts on entering edit mode and "chunky, self-explanatory" icons — versus
  CapCut's tools-at-top-plus-project-list landing screen, which left the reviewer "overwhelmed and
  confused" on first use. Framed as "a table knife" (Edits, simpler but shallower) vs. "a Swiss army
  knife" (CapCut).
- **Edits on Mac** (Nov 5, 2026): full multi-track timeline, keyframes, waveforms, shortcuts,
  imported fonts, 4K watermark-free export — explicitly pitched as "when a project gets too big for
  your phone" (Brett Westervelt, head of Edits). Pattern: keep the phone UI radically simple and move
  complexity to desktop rather than cramming both into one surface.
- **First Draft** (Aug 2026, separate feature): auto-trims raw clips, removes dead air, assembles an
  editable timeline in under 10 seconds — reframes the user from editor to reviewer. iPhone-only,
  one output at a time, fully reversible.

## 2. Instagram main app — Stories/Reels editor

- Top tool row in edit mode (tag/collab, Add Text, Stickers, filters, "...") mostly opens an
  **in-context overlay**, not a new screen.
- Filters: a horizontally scrollable strip at the bottom; one tap applies; tapping the **active**
  filter again reveals a 0–100 intensity slider. Slider is hidden until the user has already
  committed to a choice.
- Auto-captions are a toggle, not a prompt: "More options" → "Enable closed captions," with a
  separate "Translate" toggle. A "Captions" sticker alternative auto-transcribes and is editable
  word-by-word.
- **Meta AI Restyle**: paintbrush icon → Add/Remove/Change, a one-tap preset style, or a typed/spoken
  free-text prompt → result in seconds, with reload-to-regenerate and Undo *(moderate confidence)*.

## 3. Snapseed

- Three-item bottom nav: Looks | Tools | Export.
- **Gesture-only parameter control, no visible sliders inside a tool**: swipe up/down cycles which
  parameter is selected (Brightness → Contrast → Saturation → …); swipe left/right adjusts its value.
  The entire screen is the control surface.
- Selective/Spot adjustment: tap to drop a control point, pinch to size its radius, swipe
  vertically to choose a parameter for that point, horizontally to set its value.
- **Non-destructive Edit Stack**: a single icon opens the full history as a list; each entry has its
  own re-open-and-adjust and delete actions, and later steps auto-reapply on top. Stacks can be
  copied between images.
- "Save Look" (local preset) vs. "Create QR Look" (3-dot menu encodes the entire edit recipe into a
  scannable QR code another user can apply identically).
- Reviewers note a real day-one learning curve (no in-app tutorial) but describe the gesture model as
  faster than slider UIs once learned.

## 4. VSCO

- Bottom row: Filters + a separate Edit icon. Presets render as a horizontal filmstrip of thumbnails
  under the photo.
- **Tap-once-applies, tap-again-reveals-intensity** — identical shape to Instagram's filter pattern.
  Pro presets expose deeper sub-sliders (strength/contrast/color/tone) only on the second tap.
- "Recipes" = a saved full edit stack, created explicitly via a Recipes icon. Batch-applying an edit
  to many photos is a separate Copy Edits / Paste Edits action from a 3-dot menu.
- Minimalist "editorial" philosophy (heavy negative space, icons with no text labels) is well
  documented by third-party UX case studies but trades away discoverability for the sake of
  minimalism — a concrete cost, not a free win.
- Paywall UX: locked presets sit in the **same** filmstrip as free ones with a lock icon; the paywall
  modal only appears when a locked item is tapped, keeping base browsing uncluttered.

## 5. PicsArt

- Persistent, customizable bottom tray (Tools / Effects / Stickers / Text / Draw); AI generation
  starts from a separate "+" → Create entry point, not the main tray.
- **One-tap, well-defined AI tasks are instant**: Background Remover (~3s, auto-segments, refinement
  brushes available after), Background Remover 2.0-style flows.
- **Genuinely generative AI tasks are always multi-step**, buried a level deeper: AI Replace (select
  area → prompt/preset → generate → review), Generative Fill (brush → inpaint, no prompt), AI Avatar
  (upload 10–30 selfies → pick pack size → wait minutes → review batch), AI Image Generator (prompt →
  pick from 48 style filters → generate → "show more results").
- Onboarding funnel is long and paywall-forward (ATT consent → sign-up → paywall pre-selected to
  yearly → two retention modals → discount upsell → photo permission) — flagged in reviews as the
  weak point of an otherwise capable tool; an Aug 2026 update that made several paid features free
  measurably lifted App Store rating from 2.89 to 4.12.

## 6. CapCut

- Multi-track timeline with video/audio/text/overlay/effects as separate rows — the highest-chrome
  surface in this survey, and the one repeatedly singled out as overwhelming on first use compared to
  Edits.
- **Context-sensitive bottom tray**: nothing selected shows global tools (Audio/Text/Overlay/Effects);
  selecting a clip swaps the *same* tray to clip-specific tools (Split/Speed/Volume/Delete). One tray,
  two contents, instead of two permanent toolbars.
- Auto Captions is one-tap-to-trigger wrapping a multi-step review (transcribe → review/edit
  text/timing/font/color → "Apply to All" to push one style everywhere at once).
- Templates are "one-tap" only for the shell; populating placeholder clips with your own media is a
  manual per-placeholder step.
- EditPilot (PC, Sept 2026) and Director Mode (June 2026) push toward LLM-driven, plain-language
  editing instructions with an explicit autonomous/semi-autonomous (approval-gated) toggle.

## 7. Pinterest

Not primarily an editor, but two relevant references:

- **Collage tool**: Create → Collage → images auto-convert to die-cut cutouts (computer-vision
  auto-detection originating from the Shuffles app, no manual masking) → arrange freeform → add
  text/drawing/background. Collage posts get roughly 3x the saves/engagement of standard posts.
- **Masonry grid + infinite scroll "seamlessness" is an engineering outcome, not just a visual one.**
  The grid preserves native aspect ratio instead of cropping to uniform size; placement uses a greedy
  bin-pack (insert into the shortest column); the web app virtualizes the grid (only mounts DOM nodes
  near the viewport) specifically because mounting/unmounting large trees was a measured bottleneck,
  and uses dominant-color placeholders while images stream in. Worth internalizing: "seamless" scroll
  in our Explore/template grids is a performance problem as much as a design one.

## 8. Lightroom Mobile, Facetune, Remini (AI-enhancement apps)

- **Lightroom**: one-tap "Auto" enhance (Sensei) vs. multi-step AI Masking (pick mask type → AI draws
  the boundary → manual slider fine-tune within it). "Adaptive Presets" collapse both into one action.
  "Prompt to Edit" (Sept 2026, Nano Banana-based) redraws the photo from a prompt and saves a new
  generated file, consuming generative credits — explicitly kept separate from classic adjustment
  tools rather than blended in.
- **Remini**: the clearest "wow fast" pattern in this survey — upload → tap Enhance → one bundled AI
  action → result shown via a before/after swipe slider as the central UI. Separate named modes
  (Unblur, Denoise, Face Enhancer) are discrete guided flows, not sub-options buried in a menu.

## Cross-cutting patterns (what the "clean" apps share)

1. **Single persistent canvas; tools open as overlays, never as page navigation.** Edits, Stories,
   Snapseed, VSCO, and PicsArt all keep the media visible at all times. CapCut's timeline-first UI is
   the repeated counter-example for "cluttered."
2. **Hide the control until the user has committed to a choice.** Snapseed shows no slider glyphs at
   all (gesture-only); VSCO/Instagram reveal an intensity slider only on the *second* tap of an
   already-applied filter. The default browsing state has no visible numeric controls.
3. **Horizontal scrollable strips are the default list pattern** for anything with more than ~4
   items — filters, stickers, tool trays, style presets — not grids or dropdowns. This is the actual
   substance behind "carousel" praise, independent of Instagram's branding of it.
4. **One-tap AI for well-defined tasks; multi-step guided flow for anything generative.** Background
   removal, auto-enhance, and caption transcription are true one-tap actions everywhere they appear.
   Prompted/generative actions (restyle, avatar generation, generative fill, replace) always require
   at least one more step (select area, pick style, enter prompt) — no app fakes a one-tap button for
   a task that is inherently variable-latency and unpredictable.
5. **Paywalls are deferred to the point of intent.** Locked content sits inline with a small
   lock/crown badge; the paywall modal appears only on direct interaction with that item, not as a
   gate in front of browsing.
6. **Non-destructive history is tucked behind one icon, not presented as part of the main surface.**
   Snapseed's Edit Stack and VSCO's Recipes both give room to experiment without a visible "undo tree"
   cluttering the canvas.
7. **"Seamless" scrolling/grids are a performance investment**, not only a design choice (Pinterest's
   virtualization, placeholders, async rendering).
8. **Fast first "wow" moment.** Remini and PicsArt both get a user to a generated/enhanced result in
   one or two taps from the entry point, before they've learned the rest of the tool.

## How Carousel Studio compares today

Grounded in the current editor chrome (`src/editor/markup.js`, `src/editor/engine.js`,
`src/editor/editor.css`), not assumptions:

- **The bottom bar's own contents are not contextual.** `#bar` always shows the same nine tools —
  Text, Media, Shape, Stickers, Draw, Layouts, Slides, Layers, Select — regardless of selection
  state; it's a mode switcher, not a selection-aware tray. (The side inspector panel `#sh` *does*
  already auto-hide when idle via the `.idle` class, and the duplicate-looking undo/redo DOM nodes in
  the zoom bar are intentionally hidden by CSS at every size — both are already handled, not gaps.)
  CapCut's pattern goes further: the *same* tray swaps its entire content set between "nothing
  selected" and "clip selected" states, rather than keeping one fixed tool list open at all times.
- **A persistent, separate zoom bar** (`.zb`) stacks zoom in/out/fit, a slides toggle, and a
  drawing-tools dock, competing with `#bar` for the same screen edge. Competitors keep one bottom
  surface, not two.
- **Sliders are always visible, never progressively disclosed.** The adjustment panel (`panel()` /
  `S()` in `engine.js`) renders a range input *and* a number input for every property as soon as a
  tool opens — there's no VSCO/Instagram-style "tap to apply at default, tap again for precision"
  step, and no Snapseed-style gesture-only mode.
- **Grids instead of carousels for browse surfaces.** Stickers (`#xgrid`/`.sgrid`) and templates
  (`.grid`/`.tg`) use fixed grids; the only horizontal filmstrip in the app is the slide thumbnail
  strip (`#fs`). Every competitor above defaults to a horizontal strip for exactly these kinds of
  lists.
- **No visible non-destructive edit stack.** History exists (`commit()`/`undo()` with linear
  history), but there's no Snapseed-style list of named, independently re-editable steps.
- **No AI entry points yet.** No one-tap enhance, background removal, or restyle — this is a genuine
  gap versus every competitor surveyed, and also an opportunity: adding one well-defined one-tap AI
  action (e.g. background removal, since `IMG`/canvas compositing already exists) would match the
  category baseline without taking on generative/prompted complexity yet.
- **Floating/dockable panel is a desktop power-user affordance** (`#gr` drag grip, `#dock` toggle,
  `localStorage` position) with no equivalent simplification on narrow screens beyond CSS breakpoints
  shrinking the same chrome — mobile gets a smaller version of the desktop UI, not a different,
  simpler interaction model the way Snapseed's gesture mode is purpose-built for touch.

## Recommendations, roughly prioritized

**Low-risk, high-leverage (worth doing soon):**
- Make `#bar`'s own contents context-sensitive when an element is selected (CapCut pattern) —
  collapse to the relevant subset of tools for the selected element type instead of always showing
  all nine.
- Convert sticker/template grids to horizontal scrollable strips with a "see all" grid fallback,
  matching the pattern every competitor converges on.
- Add tap-to-apply/tap-again-for-intensity to at least one preset-like feature (filters, if/when
  added) before defaulting new features to always-visible sliders.

**Medium effort, high payoff:**
- A single one-tap AI feature (background removal is the best fit — well-defined, fast, and the
  category baseline) as the first AI entry point, kept behind a feature flag per
  [DESIGN_PRINCIPLES.md](DESIGN_PRINCIPLES.md).
- A visible-but-collapsed non-destructive edit history (one icon → list of steps, each
  re-editable/deletable) instead of exposing more raw toolbar surface as features grow.

**Bigger bets (need a design pass, not a quick patch):**
- A Snapseed-style gesture-only "quick adjust" mode as an alternative to the always-visible slider
  panel, for touch specifically.
- Cross-slide bleed/continuity for images and text spanning multiple carousel slides — a direct,
  implementable answer to Instagram's new Carousel editor, and arguably our most natural
  differentiator since multi-slide editing is already our core model, not a bolt-on. **Video is
  deliberately excluded from this**: as of this doc, dragging a video element clamps it to the slide
  it started on (`clampVideoToSlide()` in `engine.js`), because a swipe between carousel slides can't
  carry continuous video playback the way a bleeding photo can — a video straddling two slides was a
  real reported glitch, not a usable feature. Any future cross-slide work should keep that exclusion.

## AI-native / AI-ready codebase conventions (for maintaining this repo)

- **AGENTS.md** is now a vendor-neutral, cross-tool spec (OpenAI + Google/Cursor/Factory, donated to
  the Linux Foundation Dec 2025). GitHub's analysis of 2,500+ real-world files found six recurring
  high-value sections: exact runnable commands, testing practices, a project structure map, code
  style shown as before/after snippets, git workflow, and boundaries framed as always-do / ask-first /
  never-touch. Our [AGENTS.md](../AGENTS.md) already follows this shape (Architecture boundaries,
  Change rules, Verification and delivery) — keep extending it in the same style rather than adding a
  separate convention.
- Anthropic's own guidance for CLAUDE.md-equivalent files: keep it concise, since every line
  competes for the model's attention on every task; a soft ~200-line ceiling is a reasonable target.
  Push anything that must *always* be true into tooling (lint rule, hook, deny-rule) instead of prose.
- A Storybook-style component catalogue with an MCP server measurably improves agent output (one
  published benchmark: 12.8% better component reuse, 2.76x faster, 27% fewer tokens) — worth
  considering only if/when the component surface (currently `src/components/`) grows large enough to
  justify the setup cost; premature today for this codebase's size.
- **Feature flags as an agent safety net** is a converging 2025–2026 pattern: ship AI-authored or
  AI-facing features behind a flag at 0%, progress based on guardrail metrics, require an owner and
  an expiry date, and delete the flag after rollout. Apply this to the first AI feature
  recommendation above.
- Counter-narrative worth keeping in mind: several 2026 reports describe rising technical debt and
  maintenance cost after undisciplined AI-assisted development — directionally plausible, not
  independently verified, but the reason this repo's "small, focused changes" rule in AGENTS.md
  matters more, not less, as AI agents do more of the editing.

## Sources

Instagram Edits Carousel editor: PetaPixel (petapixel.com/2026/10/07), Android Headlines
(androidheadlines.com, Oct 2026), Kompozy (kompozy.io/news/edits-carousel-editor), Netinfluencer
(netinfluencer.com). Edits vs. CapCut comparison: Pretty Little Marketer
(prettylittlemarketer.com/blog/meta-edits-vs-capcut). Edits on Mac: TechCrunch
(techcrunch.com/2026/11/05). First Draft: PetaPixel (petapixel.com/2026/08/26), Kompozy
(kompozy.io/reviews/instagram-first-draft). Instagram nav/capture: Storrito, Kwebby, Hollyland,
iGeeksBlog, Capsai. Meta AI Restyle: TechRadar. Snapseed: Mobiography, Google Support pages,
MakeUseOf, iPhonePhotographySchool, iDownloadBlog, The Editing Studio. VSCO: iPhonePhotographySchool,
Gadget Hacks, VSCO Support, DPReview, Medium/UX Collective case studies. PicsArt: Picsart Blog,
imagen-ai.com, ScreensDesign onboarding teardown, BusinessWire (2026-03-13). CapCut: capcut.com tool
pages, TechCrunch (2026-03-26 Dreamina Seedance 2.0). Pinterest: TechCrunch (2023-05-11,
2022-08-01, 2024-05-01), Pinterest Newsroom, interfacelineage.com, paulhyunchong.com, Medium/dev
channel, Pinterest Engineering, DesignShack (opinion). Lightroom: Adobe Help, camerajabber.com.
AI-ready codebase conventions: agents.md, InfoQ (2025-08), GitHub Blog ("How to write a great
AGENTS.md"), Anthropic (Claude Code best practices), Vercel engineering blog, Design Systems
Collective, mindstudio.ai, GrowthBook/Unleash/ConfigCat blogs, cursor.com/docs/rules.

Several individual claims above are marked single-source or unverified inline; treat those as
directional, not settled fact, if they end up driving an implementation decision.
