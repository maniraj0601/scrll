---
description: Confirm the latest push actually reached production (build hash + cache headers), via the cheap deploy-verifier agent
---

Delegate to the `deploy-verifier` subagent (Haiku — this is a deterministic checklist, not a
judgment call; see `docs/AGENT_MODEL_ROUTING.md`) via the Agent tool, running in the foreground since
the user is waiting on the answer.

$ARGUMENTS (a specific commit SHA or URL to check, if given — otherwise it checks the current
`HEAD` against the project's known production URL).

If it fails on a rate-limit/overload error (unlikely for a Haiku-tier mechanical task, but handle it
the same way as any other agent per the fallback ladder), retry once at Sonnet.

Report exactly what it reports: matched or not, which commit's hash, the header values checked. Do
not deploy, push, or modify anything from this command — it only confirms a deploy that already
happened.
