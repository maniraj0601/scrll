# Design principles

Actionable rules for UI/feature work in Carousel Studio, distilled from
[UI_UX_RESEARCH.md](UI_UX_RESEARCH.md). Read that document for the competitive evidence behind each
rule. Keep this file short — it exists to be loaded on every editor UI task, so prose stays
imperative and terse, not explanatory.

## Rules

1. **Tools open as overlays on the live canvas, never as page navigation.** The canvas stays visible
   and interactive behind any panel, sheet, or dialog.
2. **Prefer context-sensitive controls over permanent ones.** Before adding a new always-visible
   button or toolbar, check whether an existing tray can swap its contents based on selection state
   instead (see `#bar` vs. CapCut's selection-aware tray in the research doc).
3. **No duplicate controls.** A given action (undo/redo, zoom, export) appears in exactly one place
   on screen at a time. If a change would add a second copy, remove or merge the first instead.
4. **Disclose controls progressively.** Default state shows the result, not the knobs: apply a
   preset/filter at a sensible default on first tap, reveal fine-grained sliders only on a deliberate
   second interaction (tap-again, long-press, or an explicit "adjust" affordance) rather than always
   rendering every slider up front.
5. **Lists longer than ~4 items default to a horizontal scrollable strip**, not a grid or dropdown,
   unless the user is explicitly browsing/searching a full catalog (templates/sticker search pages
   may stay grids).
6. **AI features: one tap for well-defined tasks, guided multi-step for anything generative.** Never
   put a prompt-based or multi-output AI action behind a button that looks like a one-tap action —
   label and structure it as a short flow (select → style/prompt → generate → review) instead.
7. **Ship every new AI-facing or AI-authored feature behind a flag**, default off, with an owner and
   an explicit removal step once rolled out. Do not leave a flag in place indefinitely.
8. **Defer paywalls/locks to the point of intent.** Locked content renders inline with a small badge;
   the upsell appears only when that specific item is tapped, never as a gate in front of browsing.
9. **Non-destructive history belongs behind one icon**, not spread across the main editing surface.
   If a feature needs its own undo-like affordance, fold it into the existing history model rather
   than adding a parallel one.
10. **"Seamless" scrolling is a performance requirement, not just a layout choice.** Virtualize long
    lists/grids and use lightweight placeholders for not-yet-loaded media before polishing their
    visual design.

## When these rules conflict with AGENTS.md

[AGENTS.md](../AGENTS.md) governs engineering invariants (coordinate systems, persistence, render
pipeline, change-size discipline) and always wins. These are product/UX defaults for *new* surface
area, not license to restructure existing engine internals — apply rule 2 by making the existing tray
context-sensitive, for example, not by rewriting `engine.js`'s panel system in one pass.
