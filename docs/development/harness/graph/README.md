# Planning an execution batch

Agent 01 runs the graph before assigning a slot. The [assignment registry](../../agents/ASSIGNMENTS.md) identifies who may change a path. The graph is a read-only forecast over a supplied snapshot. The coordinator serializes assignment updates, compares the registry with current acknowledgments and reruns the forecast before dispatch. Two independent CLI invocations do not acquire a distributed lock.

From a checkout of this branch with Node 24, Git and the pinned pnpm toolchain:

```sh
pnpm install --frozen-lockfile
git fetch origin
node scripts/harness/graph/plan.mjs docs/development/harness/graph/example.json
pnpm exec vitest run scripts/harness/graph/plan.test.mjs
```

The illustrative contract yields graph and context in one batch, holds integration until both deliver, and estimates a five-unit dependency path through context and integration. These weights are inputs chosen for this example. They are neither elapsed times nor evidence that a session ran. Fetch the parent commit in shallow checkouts before running this historical example.

## Preparing a contract

Use the [version 1 schema](../../../../scripts/harness/graph/schema.json). Assign a registered JUNO ID with an optional lowercase work-package suffix. Record owner, objective, exact base, requirements, test and acceptance criteria, deliverables, tools, skills, permissions, reservations, recovery instructions and relative effort. Use the same canonical lane name consistently. Immutable read inputs refer to the pinned Git tree. A mutable external service or shared writable directory requires a resource or path reservation. Exact names identify resource locks. Reservations use literal repository-relative paths, a trailing slash for directories, conservative Windows-compatible case folding and segment boundaries. Give empty write reservations to read-only reviewers.

A coordinator records assignment and acknowledgment separately. Executing consumes one slot. Paused, interrupted and blocked work retains its reservations and recovery record. Blocked requires a reason. Review retains path reservations while releasing the execution slot. Completion releases reservations after the applicable human acceptance and merge evidence. An agent can work on an unrelated path while another assignment is parked. Independent read-only consumers can use an unmerged reviewed-stage checkpoint after explicit publication.

To release a dependency, verify the producer's handoff, store its exact commit, full remote tracking ref and evidence URL in its checkpoint, and enter the same SHA under the consumer's dependencyPins. An awaiting-review or completed producer can release a dependency. The CLI rejects missing commits, moved remote tracking refs, or a checkpoint outside its base ancestry. It checks the shape of the evidence URL. The coordinator must inspect the evidence itself and verify that the consuming worktree includes any required code. Use the [checkpoint verifier in #125](https://github.com/oEnzoRibas/Juno/pull/125) for clean-worktree, changed-path and test receipts. A reference to a review does not authorize a merge.

Invalid structure, unknown dependencies, cycles, inconsistent active claims and Git errors exit nonzero. A valid graph with unavailable work exits zero and lists reasons under `held`. FIFO order breaks ties within a compatible batch. The critical path sums outstanding estimate units along prerequisite edges. Context switching, resource contention and queueing can add delay. Parked tasks are reported for recovery and require an explicit state update before dispatch. Recover from the registry, last published SHA and prior failure evidence. Keep the failing snapshot and the correcting revision in the handoff.
