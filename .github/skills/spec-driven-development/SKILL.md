---
name: spec-driven-development
description: Build a non-trivial Carousel Studio feature through specs/NNN-slug/{spec,plan,tasks}.md instead of jumping straight to code. Use for anything that adds/changes user-facing behavior, touches the data model, or is large enough that "what are we building" needs to be written down first. Not for one-line fixes or config tweaks — see specs/README.md's "When to skip this".
---

# Spec-driven development

## Goal

Make requirements and technical approach explicit and reviewable *before* code changes, so
implementation is small, verifiable steps against a known-good plan rather than discovery-by-diff.
This works with any AI tool or none — it's plain markdown under `specs/`, not tool-specific.

## Context to load

Read [specs/README.md](../../../specs/README.md) in full first — it owns the authoritative
description of the flow, numbering, and when to skip it. Then read
[repository instructions](../../../AGENTS.md) and the relevant [architecture section](../../../docs/ARCHITECTURE.md).
If the feature touches `src/editor/`, also read the
[editor-development skill](../editor-development/SKILL.md).

## Procedure

1. **Spec.** Copy `specs/_template/spec.md` to `specs/NNN-slug/spec.md` (next unused `NNN`). Write
   the problem, goal, user stories, and testable requirements from the user's point of view —
   no implementation detail. Mark anything you'd otherwise guess with
   `[NEEDS CLARIFICATION: <question>]` instead of picking an answer. Surface those markers before
   continuing; do not resolve them yourself.
2. **Plan.** Once the spec has no open `[NEEDS CLARIFICATION]` markers, copy
   `specs/_template/plan.md` into the same folder. Name actual owning files/functions (use the
   editor-development skill's routing table for `src/editor/`), state data-model impact and old-draft
   defaults explicitly, and check DOM-editor/canvas-export/video-export render parity if the feature
   touches anything drawn.
3. **Tasks.** Copy `specs/_template/tasks.md` into the same folder. Break the plan into small,
   independently verifiable steps in dependency order, each with a concrete done-condition.
4. **Implement.** Work the checklist per `AGENTS.md`'s change rules — small, focused diffs, no
   unrelated refactors, commit at gesture/task boundaries. Check a box only once its done-condition
   is actually verified.
5. **Verify.** Reproduce the behavior for real per `docs/DEVELOPMENT.md#validation`. For
   media/export changes, inspect the actual decoded output — a passing build and a success message
   are not proof.
6. **Ship.** Commit, and deploy/verify only when asked, per `docs/DEVELOPMENT.md#deployment`.

## Using Claude Code's accelerators

If you're in Claude Code, `.claude/commands/{specify,plan,tasks,implement,verify-deploy}.md` run
these same stages through the right subagent at the right model tier (see
[docs/AGENT_MODEL_ROUTING.md](../../../docs/AGENT_MODEL_ROUTING.md)). They're a faster way to run
this procedure, not a different one — the artifacts they produce are the same plain
`specs/NNN-slug/*.md` files this skill describes, so the workflow is identical by hand or through
any other tool that doesn't have those commands.

## Completion evidence

Report which `specs/NNN-slug/` folder was used, which stages ran, any `[NEEDS CLARIFICATION]`
markers that were surfaced and how they were resolved, and the verification actually performed
(commands run, browser paths checked, files decoded) — not just "tasks completed."
