---
name: juno-task-workflow
description: Register or resume a Juno assignment and prepare exact-revision handoffs. Use for ownership, queue decisions or interrupted work, rather than routine coding within a verified claim.
license: MIT
metadata:
  version: '1.0.0'
---

# Juno task workflow

## Inputs

Use the maintainer request, current queue and registry, and the last acknowledged handoff. Get the observed Git branch, HEAD, base and worktree status before trusting a recorded checkpoint.

## Procedure

1. Read [queue](../../../docs/development/QUEUE.md), [assignments](../../../docs/development/agents/ASSIGNMENTS.md) and [session recovery](../../../docs/development/PROTOCOL.md#recover-a-session). Treat task ownership and live execution as separate facts.
2. For new work, Agent 01 registers the next ID, dependencies, reserved paths and acceptance criteria. For resumed work, compare the saved head, Git status and published ref before editing. Preserve unpublished work and reconcile with the owner if they differ.
3. Hand off using the [template](../../../docs/development/agents/HANDOFF_TEMPLATE.md). Include exact refs, scope, observed checks and their exit codes, recovery reference, execution state and the next eligible action. Use the [checkpoint receipt check](../../../docs/development/harness/checkpoint.md) to verify a clean pin and declared path coverage.
4. If the receiving lane has no verified acknowledgement, record the published claim and preserve its reservation. An interrupted session can resume on the last verified checkpoint without reallocating the claim.

Return a task or handoff record and the evidence needed to resume it. Use read-only Git inspection by default. Assignment changes and publication require the coordinator's authorized scope. A recorded status does not start a session or establish human acceptance.
