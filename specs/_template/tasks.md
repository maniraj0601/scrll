# Tasks: <feature name>

Reads: `spec.md`, `plan.md` in this folder. Work top to bottom; a task's dependencies are the tasks
above it unless noted. Check a box only when its done-condition is actually verified, not when the
code is written.

- [ ] **T1 — <small, specific step>**
  Files: `src/...`
  Done when: <concrete, checkable condition — a behavior, not "code compiles">

- [ ] **T2 — <next step>**
  Files: `src/...`
  Done when: ...

## Verification pass

- [ ] `npm run build` passes
- [ ] Reproduced the target behavior in-browser (desktop + touch/mobile per
      `docs/DEVELOPMENT.md#validation` — list which QA matrix rows apply here)
- [ ] For media/export changes: decoded the actual output file, not just the filename/UI message
- [ ] Old drafts still open and behave correctly (if the data model changed)

## Ship

- [ ] Diff reviewed against `AGENTS.md` change rules (small, focused, no unrelated refactors)
- [ ] Commit (only when asked)
- [ ] Deploy + verify (only when asked) — see `docs/AGENT_MODEL_ROUTING.md` for the
      deploy-verifier agent, or `docs/DEVELOPMENT.md#deployment` to do it by hand
