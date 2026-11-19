# Repository instructions

## Read first

- [README](README.md): setup and product behavior.
- [Architecture](docs/ARCHITECTURE.md): state, rendering, persistence, and media pipeline.
- [Development guide](docs/DEVELOPMENT.md): change workflow, QA, troubleshooting, deployment.
- [Spec-driven development](specs/README.md): how non-trivial features get built here — spec, then
  plan, then tasks, then implementation. Start with its baseline specs (`specs/001`–`005`) for deep,
  token-cheap context on an existing subsystem before grepping cold. [Spec-driven-development skill](.github/skills/spec-driven-development/SKILL.md)
  has the tool-agnostic procedure.
- [Editor-development skill](.github/skills/editor-development/SKILL.md): focused workflow for editor changes.
- [Design principles](docs/DESIGN_PRINCIPLES.md): short UX defaults for new editor surface area. Read
  before adding or changing editor UI. Full competitive evidence is in [docs/UI_UX_RESEARCH.md](docs/UI_UX_RESEARCH.md).
- [Agent/model routing](docs/AGENT_MODEL_ROUTING.md): which subagent and model tier a task gets, and
  the fallback ladder when one is rate-limited or exhausted.

Treat source code and `package.json` as authoritative when documentation disagrees. Update the relevant guide when changing an invariant.

## Architecture boundaries

- This is a **React + Vite SPA**, not the old single-file static app. `index.html` is the only HTML entry.
- `src/main.jsx` routes `/` to `App.jsx` and `/edit` to lazy `src/editor/Editor.jsx`. Home has `#explore`, `#explore/stickers`, and `#drafts` views.
- Editor JSX owns mounting/unmounting; `engine.js` owns imperative editor DOM, document state, history, tools, rendering, and storage. Do not let React and the engine mutate the same subtree.
- `mountEditor(container, options)` returns a disposer. Register new global listeners with its `listen()` helper and release new timers, media, streams, and observers at the correct lifetime.
- Home and editor CSS are imported with `?inline` and injected by `useStyleSheet`. Do not import them globally: their selectors overlap.
- Catalog source lives in `src/catalog/`; Home and the editor must use the same definitions.

## Change rules

- Make small, focused changes. Do not reformat the dense engine or migrate unrelated systems during a feature fix.
- Reuse existing helpers and components; add dependencies only for a clear requirement and keep the lockfile consistent.
- Preserve Apple-inspired hierarchy, compact controls, responsive layout, keyboard access, focus states, and usable touch targets. Desktop must not regress for mobile improvements.
- Pointer movement updates live geometry; commit history at the interaction boundary, not on every move.
- Check screen-space versus document-space coordinates and zoom when editing interaction code.
- A video uses element `type: 'img'`; identify actual media via `IMG.get(e.k)?.type`. `speed` is playback rate; `s` is crop zoom.
- Keep editor playback, preview, trim duration, and video export consistent for media changes.
- Drafts use IndexedDB `carousel-studio`, version 1, stores `p` and `b`. Preserve existing drafts and keep `src/lib/projects.js` consistent with the engine.
- Drafts are device/origin-local. If cross-device sync is requested, prefer Netlify Database and Netlify Identity rather than introducing a third-party backend.
- Do not add a test framework or committed test files unless requested. Use the build and focused browser verification; temporary QA scripts belong outside the repository.
- Do not edit generated `dist/`, add credentials, or commit `.vercel/` or `node_modules/`.

## Spec-driven workflow and agents

Non-trivial features go through `specs/NNN-slug/{spec,plan,tasks}.md` before implementation — see
[specs/README.md](specs/README.md). Skip it for one-line fixes and config tweaks; use it for
anything adding/changing user-facing behavior or touching the data model.

Project subagents (`.claude/agents/`), by job and model tier (full policy and fallback ladder in
[docs/AGENT_MODEL_ROUTING.md](docs/AGENT_MODEL_ROUTING.md)):

| Agent | Job | Model |
| --- | --- | --- |
| `spec-author` | Idea → `spec.md`, flags `[NEEDS CLARIFICATION]` instead of guessing | Opus |
| `tech-planner` | `spec.md` → `plan.md` | Sonnet |
| `video-pipeline-engineer` | `src/editor/video-export.js` and video-specific `engine.js` paths | Sonnet |
| `editor-ui-simplifier` | Surgical UI simplification in `src/editor/` | Sonnet |
| `engine-code-reviewer` | Reviews `src/editor/` diffs against this file's invariants | Sonnet |
| `ux-competitor-research` | Keeps `docs/UI_UX_RESEARCH.md`/`DESIGN_PRINCIPLES.md` current | Sonnet |
| `deploy-verifier` | Confirms a push actually reached production | Haiku |

`.claude/commands/{specify,clarify,plan,analyze,tasks,implement,verify-deploy,constitution}.md`
drive the spec stages. `clarify`, `analyze`, and `constitution` run inline (no dedicated subagent —
spawning one costs more than these small, sequential checks save; see
`docs/AGENT_MODEL_ROUTING.md`). Default to Sonnet for anything not listed; move to Opus only for
genuinely open-ended judgment, to Haiku only for deterministic/checkable work — don't default
everything to the biggest model "to be safe."

Tooling/MCP: prefer a CLI (`gh`, `curl`) or a disposable script over registering a persistent MCP
server — a registered server costs context on every session even before its tools are used. There
is deliberately no committed `.mcp.json`; every browser check done in this repo has used a one-off
Playwright script via Bash instead. See `docs/AGENT_MODEL_ROUTING.md` for the full reasoning and
more cost/context practices (output truncation, prompt-cache batching, description-field budgets).

## Verification and delivery

Available scripts: `npm run dev`, `npm run build`, `npm run preview`. There are currently **no test, lint, or formatter scripts**; do not report them as passing.

Run `npm run build` for code changes and reproduce the affected behavior in the browser. Use the relevant rows in the [QA matrix](docs/DEVELOPMENT.md#validation). Check desktop and touch/mobile for UI changes; verify actual downloaded media for export changes, not just filenames or success messages.

Preserve unrelated worktree changes. Report what changed, what was verified, and limitations. Do not commit, push, or deploy unless requested.
