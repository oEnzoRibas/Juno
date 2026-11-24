# Development queue

This is the authoritative task order for Juno. The [assignment registry](agents/ASSIGNMENTS.md) governs active ownership, path reservations and parallel execution. Linked task records are authoritative for lifecycle status and blockers. [STATE.md](STATE.md) records resumption instructions. [WORKLOG.md](WORKLOG.md) records significant transitions.

## Active

[JUNO-0018 — Technology selection and compatibility](tasks/JUNO-0018.md).

## Pending

The [Phase 1 dependency graph](phase-1-dependencies.md) records the owner-authorized FIFO exception. Foundational implementation is blocked on approvals or on earlier runnable scopes. The six provider tasks retain their IDs and relative order.

| Position | Task |
| --- | --- |
| 4 | [JUNO-0019 — Monorepo foundation](tasks/JUNO-0019.md) |
| 5 | [JUNO-0020 — Development containerization](tasks/JUNO-0020.md) |
| 6 | [JUNO-0021 — Database and migration foundation](tasks/JUNO-0021.md) |
| 7 | [JUNO-0022 — Automated quality gates](tasks/JUNO-0022.md) |
| 8 | [JUNO-0023 — Design system baseline](tasks/JUNO-0023.md) |
| 9 | [JUNO-0024 — Authentication and invitations](tasks/JUNO-0024.md) |
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

## Coordination work

The owner authorized [JUNO-0034](tasks/JUNO-0034.md), [JUNO-0035](tasks/JUNO-0035.md) and [JUNO-0036](tasks/JUNO-0036.md) under parallel FIFO. Record bypasses in the assignment registry without changing the established provider order.

## Completed and cancelled records

See the [history index](history/README.md). IDs are never reused.
