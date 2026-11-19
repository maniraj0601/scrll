# Spec: Build, deployment, and PWA

Status: shipped (baseline — documents existing behavior, not a build target)
Owner: core app

Baseline spec — see `specs/001-editor-engine/spec.md`'s header note for what that means.

## Problem

The app must build reproducibly on any machine, deploy to either of two static hosts, and work
offline for its app shell so a saved draft stays editable without a connection.

## Goal

- `npm ci && npm run build` produces a deployable `dist/` on any machine meeting the Node
  requirement, with no environment variables or backend required.
- The app shell (JS/CSS/HTML) loads offline; already-saved drafts remain openable and editable
  offline, since they live in IndexedDB, not a server.

## Non-goals

- Server-side rendering, a custom Node server, or any backend service.

## Requirements

1. `npm run build` (Vite) is the only build step both `vercel.json` and `netlify.toml` invoke;
   both serve the generated `dist/` with SPA rewrites so a direct link to `/edit?...` works without
   a server-side route.
2. Vercel additionally declares immutable caching for hashed build assets (`assets/*.js` etc.) —
   verifying a deploy means confirming the *hash* the live URL serves matches the local build's
   hash, not just that the URL responds.
3. The PWA plugin (`vite-plugin-pwa`, `registerType: 'autoUpdate'`) precaches the app shell only.
   Drafts and original media (IndexedDB) are never part of the precache/service-worker cache — the
   service worker's job is "the app loads and already-saved drafts keep working offline," not
   "offline creation of new content requiring uncached external catalog assets."
4. Some catalog photography/sticker assets are external URLs; a fully offline fresh session may not
   load those specific assets. This is a known, accepted limitation, not a bug to silently work
   around by inlining everything.
5. No application environment variables or secrets are required to build or run locally. Node
   version requirement (currently 20.19+/22.12+, see `package.json`'s `engines` and `.nvmrc`) is the
   only environment precondition.
6. `dist/`, `node_modules/`, and `.vercel/` are never committed; generated files and machine-local
   deployment linkage stay out of version control.

## Constraints from the constitution

- `AGENTS.md`: "Do not edit generated `dist/`, add credentials, or commit `.vercel/` or
  `node_modules/`."
- `docs/DEVELOPMENT.md` "Deployment" section: build and verify before publishing; deploy only when
  requested; never assume a git push auto-publishes; drafts are origin-local so a different deploy
  hostname won't show an old hostname's drafts.
- `docs/AGENT_MODEL_ROUTING.md`: deployment verification is a Haiku-tier mechanical check
  (`deploy-verifier` agent / `/verify-deploy` command) — hash comparison plus cache headers, not a
  judgment call.

## Out of scope / explicitly deferred

- CI/CD pipeline changes, multi-environment staging setups, or any backend/database integration
  beyond what's already described in `specs/003-persistence-and-drafts`.
