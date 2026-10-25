# AGENTS.md

## Architecture
Static site. The whole app is one self-contained file, `public/index.html` (inline `<style>` and `<script>`). There is no framework, bundler, or package.json, and no build step: `netlify.toml` publishes `public/` directly.

## Key files
- `public/index.html`: the Carousel Studio app (templates view, recent drafts, preview)
- `netlify.toml`: publish directory and basic security headers

## Conventions and notes
- Drafts persist in the browser on the visitor's device. If cross-device sync is ever needed, use Netlify Database (and Netlify Identity for accounts) rather than adding a third-party backend.
- Keep the app dependency-free unless a feature clearly requires otherwise. Edit `public/index.html` in place.
