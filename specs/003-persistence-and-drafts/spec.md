# Spec: Persistence and drafts

Status: shipped (baseline — documents existing behavior, not a build target)
Owner: core app

Baseline spec — see `specs/001-editor-engine/spec.md`'s header note for what that means.

## Problem

Users need their in-progress carousels saved without an account or backend, including the original
photo/video files (not just a thumbnail), and old drafts must keep working as the app evolves.

## Goal

- A draft survives reload/reopen with its full document, original media, and metadata intact.
- Adding a new field to the document model never breaks a draft saved before that field existed.

## Non-goals

- Cross-device sync or any account system. There is no backend.

## Requirements

1. All persistence is client-side IndexedDB, database `carousel-studio`, version 1, with exactly
   two stores: `p` (keyed by project `id`; record has name, timestamps, slide count, height,
   preview target, thumbnail, serialized `doc`, and an `imgs` manifest) and `b` (keyed by
   `${projectId}|${imageKey}`; value is the original media Blob/File).
2. The serialized document never contains a DOM node, canvas, stream, or object URL — only
   plain, structurally-cloneable data. Runtime media objects are reconstructed on load from the `b`
   store via `load()`, never serialized themselves.
3. A new document/element field is added with a backward-compatible default so a draft saved before
   that field existed opens correctly, not with missing data or a crash. A schema migration updates
   both DB-opening code paths and accounts for existing projects — it never silently drops older
   drafts.
4. `src/lib/projects.js` (summaries/deletion) and the engine's own save/open/import code stay
   consistent with each other and with the actual document shape — a field renamed or restructured
   in one must be reflected in both.
5. Drafts are scoped to the browser profile and origin: localhost, a preview deployment URL, and
   the production domain each have their own separate IndexedDB store and share no drafts. This is
   not a bug to "fix" by centralizing storage — it's the correct behavior for client-only storage,
   and any report of "my draft disappeared" should check origin/profile before anything else.
6. Importing slides from another draft copies the referenced media and scales the imported slides'
   geometry to fit the destination document, rather than assuming identical dimensions.

## Constraints from the constitution

- `AGENTS.md`: "Drafts are device/origin-local. If cross-device sync is requested, prefer Netlify
  Database and Netlify Identity rather than introducing a third-party backend." "Preserve existing
  drafts and keep `src/lib/projects.js` consistent with the engine."
- `docs/DEVELOPMENT.md` troubleshooting: do not clear site data as a first troubleshooting step for
  a "missing draft" report — check origin/protocol/port first.

## Out of scope / explicitly deferred

- Any cloud backup, account system, or cross-device sync, unless explicitly requested — and if so,
  Netlify Database/Identity are the stated preference over a new third-party backend.
