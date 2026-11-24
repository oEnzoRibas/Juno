# Development queue

This is the authoritative task order for Juno. The [assignment registry](agents/ASSIGNMENTS.md) governs active ownership, path reservations and parallel execution. Linked task records are authoritative for lifecycle status and blockers. [STATE.md](STATE.md) records resumption instructions. [WORKLOG.md](WORKLOG.md) records significant transitions.

## Integrated baseline

The approved foundation landed at `3053a7beab1ec657305634c77df46efe4ec472f1`. The [post-UAT handoff](agents/agent-01/handoffs/juno-post-uat-integration.md) records the active and successor claims. Platform regression and shell integrations #36 and #37 remain under review. Preserve the optional provider ordering.

## Active

[JUNO-0028 — Organizational management foundation](tasks/JUNO-0028.md) is active for the member directory increment. Agent 02 and Agent 03 retain the [published integration handoffs](agents/agent-01/handoffs/juno-post-uat-integration.md).

## Pending

The [Phase 1 dependency graph](phase-1-dependencies.md) records the owner-authorized FIFO exception. Foundational implementation is ordered by their implementation dependencies. The six provider tasks retain their IDs and relative order.

| Position | Task |
| --- | --- |
| 14 | [JUNO-0029 — Integration Hub foundation](tasks/JUNO-0029.md) |
| 15 | [JUNO-0030 — Gamification foundation](tasks/JUNO-0030.md) |
| 16 | [JUNO-0006 — GitHub provider feasibility and implementation](tasks/JUNO-0006.md) |
| 17 | [JUNO-0007 — GitHub Projects provider feasibility and implementation](tasks/JUNO-0007.md) |
| 18 | [JUNO-0008 — YouTube provider feasibility and implementation](tasks/JUNO-0008.md) |
| 19 | [JUNO-0009 — SharePoint provider feasibility and implementation](tasks/JUNO-0009.md) |
| 20 | [JUNO-0010 — Slack provider feasibility and implementation](tasks/JUNO-0010.md) |
| 21 | [JUNO-0011 — Notion provider feasibility and implementation](tasks/JUNO-0011.md) |

## Under review

- [JUNO-0022](tasks/JUNO-0022.md), integrated workflow in #31 and remaining [audit regression #36](https://github.com/oEnzoRibas/Juno/pull/36).
- [JUNO-0027](tasks/JUNO-0027.md), [application shell #37](https://github.com/oEnzoRibas/Juno/pull/37), owned by Agent 02.
- [Maintainer acceptance and protocol #38](https://github.com/oEnzoRibas/Juno/pull/38), including the pinned UAT record and alpha gates.

## Integrated scope

- Runtime foundation and accepted onboarding. JUNO-0017 through JUNO-0021, JUNO-0023 through JUNO-0026, and JUNO-0036 have integrated increments. Broader delegated authorization remains in JUNO-0026.
- Phase 0, coordination and worktree organization. See the [historical audit](phase-0-review-guide.md) and [post-merge checkpoint](history/JUNO-0034-post-merge-sync.md).

## Coordination work

The owner authorized [JUNO-0034](tasks/JUNO-0034.md), [JUNO-0035](tasks/JUNO-0035.md) and [JUNO-0036](tasks/JUNO-0036.md) under parallel FIFO. Record bypasses in the assignment registry without changing the established provider order.

## Completed and cancelled records

See the [history index](history/README.md). IDs are never reused.
