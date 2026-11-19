# Spec: <feature name>

Status: draft | clarified | planned | in progress | shipped
Owner: <who/what requested this>

## Problem

What's wrong or missing today, from the user's point of view. Not "we should add X" — describe the
pain X relieves. One or two paragraphs.

## Goal

What success looks like, in user-observable terms. Bullet list of outcomes, not implementation.

## Non-goals

What this explicitly does not cover, so the plan phase doesn't scope-creep into it.

## User stories

- As a <who>, I want to <do what>, so that <why>.
- ...

Order by priority. Each story should be independently shippable/testable, not a sub-step of another.

## Requirements

Numbered, testable, unambiguous. Prefer "the X does Y when Z" over adjectives like "fast" or
"intuitive" — if those matter, state the concrete behavior that makes them true.

1. ...
2. ...

Mark anything you're guessing at instead of actually knowing:

`[NEEDS CLARIFICATION: <the specific open question>]`

Do not resolve a `NEEDS CLARIFICATION` by picking the option that seems more likely — surface it.

## Constraints from the constitution

Which `AGENTS.md` / `docs/ARCHITECTURE.md` invariants this feature must respect or risks brushing
against (e.g. draft backward-compatibility, DOM-editor/canvas-export parity, no new test
framework). Pull the specific lines, don't just say "AGENTS.md applies."

## Out of scope / explicitly deferred

Related ideas that came up but aren't part of this spec, so they don't get silently folded in
during implementation.
