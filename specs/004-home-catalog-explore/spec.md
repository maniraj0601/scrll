# Spec: Home, catalog, and Explore

Status: shipped (baseline — documents existing behavior, not a build target)
Owner: core app

Baseline spec — see `specs/001-editor-engine/spec.md`'s header note for what that means.

## Problem

Users need a starting point before they're inside the editor: browse templates and trending
layouts, find stickers, manage saved drafts and favorites, and get into editing in one tap — all as
a normal React SPA, distinct from the editor's imperative surface.

## Goal

- Home, Explore, and Drafts are reachable as hash views (`#explore`, `#explore/stickers`,
  `#drafts`) within the single-page app, sharing one catalog source of truth with the editor.
- Every entry point into the editor (`?new=`, `?template=`, `?sticker=`, `?open=`) produces a
  correctly-initialized document.

## Non-goals

- This spec does not cover what happens once inside the editor (see `specs/001-editor-engine`) or
  how media is actually exported (see `specs/002-video-export-pipeline`).

## Requirements

1. `src/main.jsx` is a lightweight pathname router: `/` renders `App.jsx` and Home's reusable
   Studio components; `/edit` lazy-loads `Editor.jsx`. `/editor.html` is a compatibility redirect
   only, never a second editor implementation.
2. `src/catalog/` (`CAROUSELS`, `LAYOUTS`, plus `catalog/index.js`'s derived `TEMPLATES`,
   `EXPLORE`, and hand-picked `TRENDING`) is the single source of truth for both Home's previews and
   the editor's document creation (`toDoc()`). A catalog entry must render identically in
   `SlidePreview.jsx` and in the editor after `toDoc()` conversion — changing the layer schema means
   checking both.
3. Editor links carry intent via query string: `?new=1&ar=4%2F5&n=3` (new project; supported ratios
   are `4/5`, `1/1`, `9/16`; max 20 slides), `?template=id`, `?sticker=id`, `?open=projectId`. The
   engine rewrites a newly opened design to its saved-draft URL.
4. A missing/invalid draft or template ID returns the user to Home rather than erroring into a
   broken editor state.
5. Home/editor CSS is route-scoped: each is imported with `?inline` and injected via
   `useStyleSheet`, never imported globally — their selectors overlap and a global import would
   leak styling across routes.
6. Favorites and sharing (QR code / share dialog) operate on catalog/draft references, not copies —
   favoriting a template doesn't fork it, and sharing a draft doesn't upload it anywhere (there is
   no backend; see `specs/003-persistence-and-drafts`).

## Constraints from the constitution

- `AGENTS.md`: "This is a React + Vite SPA... `index.html` is the only HTML entry," "Home and
  editor CSS are imported with `?inline`... Do not import them globally," "Catalog source lives in
  `src/catalog/`; Home and the editor must use the same definitions."
- `docs/ARCHITECTURE.md` "Routes and catalog" section has the full query-string reference and
  catalog structure.

## Out of scope / explicitly deferred

- Server-rendered previews, account-gated content, or any catalog content not already defined in
  `src/catalog/`.
