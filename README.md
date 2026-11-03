# Carousel Studio

Carousel Studio is a browser-based carousel design tool. The React template library is the main entry point; the existing full-featured editor remains available at `/editor.html` while its editing workflows are migrated. Drafts are stored on the visitor's device, so no account or backend is needed.

## Technology

- React 19 and Vite
- Lossless individual PNG exports for selected slides, generated in the browser
- Reusable UI in `src/components/`, template data and filters in `src/lib/templates.js`
- Responsive, system-aware interface with reduced-motion support

## Running locally

Install the locked dependencies and start the development server:

```bash
npm ci
npm run dev
```

Create and preview a production build with `npm run build` and `npm run preview`.

## Deploying

Netlify runs the Vite production build and publishes `dist/` (see `netlify.toml`).
