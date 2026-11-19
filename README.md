# Carousel Studio

Carousel Studio is a browser-based carousel and collage designer for desktop and mobile. Browse templates and trending layouts, add photos or videos, draw, preview, and download selected slides. Drafts and original media stay in the browser's IndexedDB; there is no account or application backend.

## Start here

| Audience | Guide |
| --- | --- |
| Running, changing, or validating the app | [Development guide](docs/DEVELOPMENT.md) |
| Understanding rendering, storage, and exports | [Architecture](docs/ARCHITECTURE.md) |
| AI coding agents | [Repository instructions](AGENTS.md) |
| Building a non-trivial feature | [Spec-driven development](specs/README.md) |
| Working on editor features | [Editor-development skill](.github/skills/editor-development/SKILL.md) |
| UI/UX decisions and competitive research | [Design principles](docs/DESIGN_PRINCIPLES.md), [UI/UX research](docs/UI_UX_RESEARCH.md) |
| Which agent/model handles what | [Agent/model routing](docs/AGENT_MODEL_ROUTING.md) |
| Competitive/web research tooling | [Research tooling](docs/RESEARCH_TOOLING.md) |

## Running locally

Use Node.js **22.12+** (or 20.19+), as required by the current Vite dependency, and npm:

```bash
npm ci
npm run dev
```

```bash
npm run build
npm run preview
```

Open the URL Vite prints. The home page is `/`; the editor is `/edit`, opened with a template, new-canvas, or saved-draft query. For example:

```text
/edit?new=1&ar=4%2F5&n=3
```

This creates three portrait slides. `/editor.html` is a compatibility redirect, not a second editor file.

## Features and export behavior

- React + Vite SPA with a lazy-loaded editor, shared catalog, and route-scoped styles.
- Templates on Home; trending layouts and stickers in Explore; local drafts with slide import.
- Text, shapes, stickers, drawing, image adjustments, layouts, and photo/video frames.
- Compact video trimming and per-clip playback speed from 0.25x to 4x.
- Auto export: video slides become composed videos; still slides become lossless PNGs.
- Explicit Video, PNG, JPG, WebP, and PDF choices. Selected slides download directly, without ZIP.

Video includes the layout, trims, playback speed, and mixed original audio. Downloads are MP4: if native MP4 recording fails, an intermediate WebM recording is converted locally to H.264/AAC MP4 without reducing resolution. Recovery requires browser encoding support and may take an extra step; it fails clearly rather than downloading WebM or dropping audio. Recording happens in real time in a visible tab, targets 30 fps, and is re-encoded rather than lossless. PDF and image formats flatten video to a still frame. Unnamed projects export as `slide-01`, `slide-02`, etc.; named projects use the project name as the filename prefix.

Drafts are origin-specific: localhost, preview URLs, and production domains do **not** share them. Clearing site data can remove drafts; browser-local storage is not a cloud backup.

## Deploying

Both [Vercel](vercel.json) and [Netlify](netlify.toml) build with `npm run build` and serve `dist/`. SPA rewrites support direct editor links. Do not edit or commit generated `dist/` or machine-local `.vercel/` files.

See the [deployment checklist](docs/DEVELOPMENT.md#deployment) before publishing.
