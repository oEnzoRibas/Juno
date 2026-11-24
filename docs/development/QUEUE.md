# Development queue

This is the authoritative task order for Juno. The [assignment registry](agents/ASSIGNMENTS.md) governs active ownership, path reservations and parallel execution. Linked task records are authoritative for lifecycle status and blockers. [STATE.md](STATE.md) records resumption instructions. [WORKLOG.md](WORKLOG.md) records significant transitions.

## Active

[JUNO-0022 — Automated quality gates](tasks/JUNO-0022.md) and [JUNO-0023 — Design system baseline](tasks/JUNO-0023.md). [JUNO-0024 — Authentication and invitations](tasks/JUNO-0024.md) is in progress. Local quality checks are runnable, and workflow publication waits on credential scope.

## Pending

The [Phase 1 dependency graph](phase-1-dependencies.md) records the owner-authorized FIFO exception. Foundational implementation is ordered by their implementation dependencies. The six provider tasks retain their IDs and relative order.

| Position | Task |
| --- | --- |
| 10 | [JUNO-0025 — Tenant context and database isolation](tasks/JUNO-0025.md) |
| 11 | [JUNO-0026 — Authorization and audit foundation](tasks/JUNO-0026.md) |
| 12 | [JUNO-0027 — Application shell](tasks/JUNO-0027.md) |
| 13 | [JUNO-0028 — Organizational management foundation](tasks/JUNO-0028.md) |
| 14 | [JUNO-0029 — Integration Hub foundation](tasks/JUNO-0029.md) |
| 15 | [JUNO-0030 — Gamification foundation](tasks/JUNO-0030.md) |
| 16 | [JUNO-0006 — GitHub provider feasibility and implementation](tasks/JUNO-0006.md) |
| 17 | [JUNO-0007 — GitHub Projects provider feasibility and implementation](tasks/JUNO-0007.md) |
| 18 | [JUNO-0008 — YouTube provider feasibility and implementation](tasks/JUNO-0008.md) |
| 19 | [JUNO-0009 — SharePoint provider feasibility and implementation](tasks/JUNO-0009.md) |
| 20 | [JUNO-0010 — Slack provider feasibility and implementation](tasks/JUNO-0010.md) |
| 21 | [JUNO-0011 — Notion provider feasibility and implementation](tasks/JUNO-0011.md) |

## Under review

- [JUNO-0021](tasks/JUNO-0021.md), tenant schema, forced row-level policies and verified database regression.

- [JUNO-0020](tasks/JUNO-0020.md), Compose baseline with runtime migration and local smoke checks.

- [JUNO-0018](tasks/JUNO-0018.md) and [JUNO-0019](tasks/JUNO-0019.md), pinned and runnable workspace.

- [JUNO-0017](tasks/JUNO-0017.md), owner-approved architecture direction.
- [JUNO-0031](tasks/JUNO-0031.md), [PR #20](https://github.com/oEnzoRibas/Juno/pull/20).
- [JUNO-0016](tasks/JUNO-0016.md), [PR #19](https://github.com/oEnzoRibas/Juno/pull/19), ready for review.
- [JUNO-0015](tasks/JUNO-0015.md), [PR #18](https://github.com/oEnzoRibas/Juno/pull/18), ready for review.
- [JUNO-0014](tasks/JUNO-0014.md), [PR #17](https://github.com/oEnzoRibas/Juno/pull/17), ready for review.
- [JUNO-0013](tasks/JUNO-0013.md), [PR #16](https://github.com/oEnzoRibas/Juno/pull/16), ready for review.
- [JUNO-0012](tasks/JUNO-0012.md), [PR #15](https://github.com/oEnzoRibas/Juno/pull/15), ready for review.
- [JUNO-0005](tasks/JUNO-0005.md), [PR #13](https://github.com/oEnzoRibas/Juno/pull/13), ready with an open merge prerequisite.
- [JUNO-0004](tasks/JUNO-0004.md), [PR #12](https://github.com/oEnzoRibas/Juno/pull/12), repaired and ready for review.
- [JUNO-0003](tasks/JUNO-0003.md), native stack #14, with #1 merged before this session and #2–#11 ready. See the [live audit](phase-0-review-guide.md).

## Verified post-merge checkpoint

Use this checkpoint for current status while the Phase 1 task-record changes remain in review. See the [stack audit](history/JUNO-0034-post-merge-sync.md) for exact revisions and incremental scopes.

- Merged by the owner: JUNO-0017 architecture (#21), JUNO-0033 worktree policy (#25), JUNO-0034 coordination (#28), and JUNO-0035 diagrams (#30).
- Runtime review: JUNO-0018/0019 (#22), JUNO-0020 (#23), JUNO-0021 (#24), JUNO-0024/0025 (#26 and #27), JUNO-0036 (#29) and the JUNO-0026 bounded audit and capabilities (#34 and #35).
- Parallel claims: Agent 01 continues the JUNO-0026 API contract, Agent 02 owns JUNO-0027 on the reviewed JUNO-0023 design candidate (#33), and Agent 03 owns JUNO-0022 (#31 and the released audit SQL runner follow-up).
- JUNO-0028 broader organization work, JUNO-0029, JUNO-0030 and the six optional provider tasks retain the dependency and review gates recorded below or in the Phase 1 graph.

## Coordination work

The owner authorized [JUNO-0034](tasks/JUNO-0034.md), [JUNO-0035](tasks/JUNO-0035.md) and [JUNO-0036](tasks/JUNO-0036.md) under parallel FIFO. Record bypasses in the assignment registry without changing the established provider order.

## Completed and cancelled records

See the [history index](history/README.md). IDs are never reused.
