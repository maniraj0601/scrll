# AGENTS.md

## Architecture
React 19 single-page app built with Vite. The app entry is `index.html`; React code lives in `src/`, with reusable components in `src/components/` and catalog logic in `src/lib/templates.js`. Vite outputs to `dist/`, which Netlify publishes.

## Key files
- `src/App.jsx`: template library, search and filters
- `src/components/`: reusable template card, slide preview, and preview dialog
- `src/lib/templates.js`: template catalog and filter metadata
- `editor.html`: existing full-featured editor and lossless individual PNG export flow, built as a second Vite page
- `netlify.toml`: build command, publish directory, and basic security headers

## Conventions and notes
- Drafts persist in the browser on the visitor's device. If cross-device sync is ever needed, use Netlify Database (and Netlify Identity for accounts) rather than adding a third-party backend.
- Keep dependencies minimal and prefer native browser APIs.
- Export selected slides as individual lossless PNGs; browsers may require permission for multiple downloads.
- Run `npm run build` to validate production changes.
