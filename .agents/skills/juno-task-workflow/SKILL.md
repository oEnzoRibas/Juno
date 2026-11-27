---
name: juno-task-workflow
description: Register or resume a Juno assignment and prepare exact-revision handoffs. Use for ownership, queue decisions or interrupted work, rather than routine coding within a verified claim.
license: MIT
metadata:
  version: '1.1.0'
---

# Juno task workflow

## Inputs

Use the approved GitHub issue, the exact worktree base and the last execution checkpoint. Verify branch, HEAD and uncommitted work before editing.

## Procedure

1. Agent 00 releases only eligible work with a pinned base, owner, writable paths, dependency and acceptance criteria. Send it through verified native delegation. Record assignment, acknowledgement and observed execution separately.
2. Hold one durable execution checkpoint with the exact revision, observed checks, failures and next action. After interruption, preserve the claim and reconcile Git state before resuming.
3. Use the [checkpoint verifier](../../../docs/development/harness/checkpoint.md) for a clean revision and declared path coverage. Handoff the verified result to the coordinator. GitHub records backlog and PR disposition.

Return a task or handoff record and the evidence needed to resume it. Use read-only Git inspection by default. Assignment changes and publication require the coordinator's authorized scope. A recorded status does not start a session or establish human acceptance.
