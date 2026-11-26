---
name: juno-review-environment
description: Start, inspect, test, or recover an isolated Juno pull request review environment using exact Git and runtime provenance. Use for review launcher or disposable Compose work.
---

Read the repository [agent instructions](../../../AGENTS.md), the [review launcher guide](../../../scripts/review/README.md), and the PR's review instructions. For image attestation and composed candidates, use the [runtime identity guide](../../../docs/testing/juno-review-runtime.md).

- Resolve the authorized full Git SHA and expected tree. For a live pull request, compare the pin with GitHub before building. A moved PR head needs a confirmed new pin or an explicitly historical review from a detached checkout. Record each companion PR and its full SHA for a composed candidate.
- For a trusted live head, use `pnpm review:test --pr <number> --sha <full-sha>` for disposable parity. Use `pnpm review:start` and `pnpm review:status` for interactive review. Select unused loopback ports if automatic selection is unsuitable. On Windows, a short private `TEMP` and `TMP` can avoid path-length failures. Preserve existing UATs and peer review sessions.
- Tie the result to the verified checkout and running web/API image IDs, observed readiness from web to API, and database schema. Report compiled provenance as unavailable when the revision or image cannot attest it. For a pinned composition with the archive builder, supply each approved `--include-pr NUMBER:FULL_SHA` using the runtime identity guide.
- Keep credentials retrieval private. When structured browser evidence must survive automatic cleanup, set `JUNO_REVIEW_REPORT` to an absolute path in a private evidence directory outside the disposable checkout. Verify that the candidate reporter supports it.
- After an interruption, determine whether the original runner still owns a lock or is active. Inspect the exact review state, checkout, Compose project, and Docker engine before rerunning or stopping. Use `pnpm review:stop --pr <number>` for an owned persistent review. A stop refusal calls for inspection and preservation of unexpected edits or outputs. For a historical or manually composed run, clean only resources owned by that run. Report any remainder.

Use [juno-independent-review](../juno-independent-review/SKILL.md) when the task also asks for an independent verdict on the evidence.
