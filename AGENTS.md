# AGENTS.md

## Architecture
React + Vite single-page app with one HTML entry (`index.html`). `npm run build` outputs `dist/`, which Netlify publishes (`netlify.toml` adds the SPA fallback and redirects old `/editor.html` links to `/edit`).

- `/` → Studio home (`src/App.jsx`), with hash views:
  - Home: create panel, recent drafts, and the regular carousel Templates.
  - `#explore` (Layouts) and `#explore/stickers` (Stickers): `src/components/Explore.jsx`, with the Trending rail ids in `src/catalog/index.js`.
  - `#drafts`.
- `/edit?template=id | ?new=1&ar=4/5&n=3 | ?sticker=id | ?open=projectId` → editor (`template` accepts carousel or layout ids), lazy-loaded (`src/editor/Editor.jsx`).

## Key files
- `src/main.jsx`: root router (`src/lib/router.js`, a tiny History-API store with `navigate`/`goBack`/`linkClick`).
- `src/editor/engine.js`: the imperative editor engine. `mountEditor(el, { search, onExit, onMissing })` returns a dispose function. Register global listeners with `listen()` so they are removed on unmount.
- `src/editor/markup.js` and `src/editor/editor.css`: the editor chrome and its styles.
- `src/catalog/`: templates, layouts and gradients, shared by the home previews and the editor.
- `src/lib/projects.js`: reads drafts from IndexedDB (`carousel-studio`; stores `p` and `b`). The schema must match the engine.

## Conventions and notes
- CSS is route-scoped. Home uses `src/styles.css` and the editor uses `editor.css`; both are imported with `?inline` and injected via `useStyleSheet`. Don't import either globally, because they share selectors.
- Drafts persist in the browser on the visitor's device. If cross-device sync is ever needed, use Netlify Database (and Netlify Identity for accounts) rather than adding a third-party backend.
- Keep dependencies minimal.
