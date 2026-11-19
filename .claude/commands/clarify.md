---
description: Resolve a spec's [NEEDS CLARIFICATION] markers with the user before planning (stage 1.5 of the spec-driven workflow)
---

Target spec folder or feature slug: $ARGUMENTS (if omitted, find the most recently modified
`specs/NNN-*/spec.md` that still has `[NEEDS CLARIFICATION]` markers).

Run this **inline, not as a subagent** — it's a short, interactive exchange with the user, and a
subagent can't reliably drive AskUserQuestion itself. This task is also small enough that spawning
a fresh ~25k-token subagent context for it would cost more than it saves (see
`docs/AGENT_MODEL_ROUTING.md`).

1. Read the target `spec.md` and extract every `[NEEDS CLARIFICATION: ...]` marker verbatim.
2. If there are none, say so and stop — the spec is already clear, nothing to do.
3. Group related questions and put them to the user via AskUserQuestion (batch them into as few
   question calls as sensibly fit the tool's 1-4 question limit per call; don't fire one call per
   marker if several are related).
4. For each answer, edit `spec.md` directly: replace the marker with the resolved requirement,
   written the same way the rest of the spec is written (testable, user-observable), not as a raw
   restatement of the user's answer.
5. If an answer introduces a new requirement or changes scope, update the spec's other sections
   (Non-goals, Out of scope) so they stay consistent — don't leave a contradiction between the
   resolved requirement and an older section.

Report the spec's path and confirm no `[NEEDS CLARIFICATION]` markers remain, or list which ones
still do and why (e.g. the user deferred a decision). Tell the user it's ready for `/plan` only if
fully resolved.
