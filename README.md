# Carousel Studio

Carousel Studio is a browser-based app for browsing carousel templates and editing drafts. Drafts autosave to the visitor's own device (browser storage), so no server or account is needed.

## Technology

- A single self-contained HTML file (`public/index.html`) with inline CSS and JavaScript
- Google Fonts (Caveat, DM Sans, Playfair Display)
- Hosted on Netlify as a static site, no build step

## Running locally

Open `public/index.html` in a browser, or serve the folder:

```bash
npx serve public
```

## Deploying

Netlify publishes the `public` directory as-is (see `netlify.toml`). Push to `main` to deploy.
