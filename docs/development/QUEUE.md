# Development queue

This is the authoritative task order for Juno. The [assignment registry](agents/ASSIGNMENTS.md) governs active ownership, path reservations and parallel execution. Linked task records are authoritative for lifecycle status and blockers. [STATE.md](STATE.md) records resumption instructions. [WORKLOG.md](WORKLOG.md) records significant transitions.

## Integrated baseline

[JUNO-0046 through JUNO-0053](harness/README.md#migration-and-gates) form the owner-authorized harness intervention after the 2026-11-26 review cycle. The cohort advances independently of product work with published path reservations. [JUNO-0054](tasks/JUNO-0054.md) releases original mascot concepts and leaves official artwork subject to the maintainer's concept approval. The prior product order and unresolved policy gates remain in the historical queue and linked tasks.

The approved foundation landed at `3053a7beab1ec657305634c77df46efe4ec472f1`. The [post-UAT handoff](agents/agent-01/handoffs/juno-organizational-cycle.md) records the active and successor claims. Platform regression and shell integrations #36 and #37 remain under review. Preserve the optional provider ordering.

## Active

[JUNO-0028 — Organizational management foundation](tasks/JUNO-0028.md) has a validated [member directory increment](https://github.com/oEnzoRibas/Juno/pull/40) awaiting review. Core delivered member filters, detail and the auditable organization profile API in [#41 and #45](https://github.com/oEnzoRibas/Juno/pull/45). Membership lifecycle and delegated directorate authority need confirmed policy. Agent 02 and Agent 03 have released [parallel assignments](agents/agent-01/handoffs/juno-organizational-cycle.md).

[JUNO-0038 — Independent self-hosted distribution](tasks/JUNO-0038.md) is released alongside organization management. Dependencies and reservations are in the distribution handoff.

## Pending

The [Phase 1 dependency graph](phase-1-dependencies.md) records the owner-authorized FIFO exception. Foundational implementation is ordered by their implementation dependencies. The six provider tasks retain their IDs and relative order.

| Position | Task                                                                                      |
| -------- | ----------------------------------------------------------------------------------------- |
| 14       | [JUNO-0029 — Integration Hub foundation](tasks/JUNO-0029.md)                              |
| 15       | [JUNO-0030 — Gamification foundation](tasks/JUNO-0030.md)                                 |
| 16       | [JUNO-0006 — GitHub provider feasibility and implementation](tasks/JUNO-0006.md)          |
| 17       | [JUNO-0007 — GitHub Projects provider feasibility and implementation](tasks/JUNO-0007.md) |
| 18       | [JUNO-0008 — YouTube provider feasibility and implementation](tasks/JUNO-0008.md)         |
| 19       | [JUNO-0009 — SharePoint provider feasibility and implementation](tasks/JUNO-0009.md)      |
| 20       | [JUNO-0010 — Slack provider feasibility and implementation](tasks/JUNO-0010.md)           |
| 21       | [JUNO-0011 — Notion provider feasibility and implementation](tasks/JUNO-0011.md)          |

## Under review

- [JUNO-0022](tasks/JUNO-0022.md), integrated workflow in #31 and remaining [audit regression #36](https://github.com/oEnzoRibas/Juno/pull/36).
- [JUNO-0027](tasks/JUNO-0027.md), [application shell #37](https://github.com/oEnzoRibas/Juno/pull/37), owned by Agent 02. The maintainer's V2 playground approval releases implementation. The [handoff](agents/agent-01/handoffs/juno-0027-v2-implementation.md) defines independent QA and the stable V2 adoption gate for #43, #48 and #51.
- [Maintainer acceptance and protocol #38](https://github.com/oEnzoRibas/Juno/pull/38), including the pinned UAT record and alpha gates.

## Integrated scope

- Runtime foundation and accepted onboarding. JUNO-0017 through JUNO-0021, JUNO-0023 through JUNO-0026, and JUNO-0036 have integrated increments. Broader delegated authorization remains in JUNO-0026.
- Phase 0, coordination and worktree organization. See the [historical audit](phase-0-review-guide.md) and [post-merge checkpoint](history/JUNO-0034-post-merge-sync.md).

## Coordination work

The owner authorized [JUNO-0034](tasks/JUNO-0034.md), [JUNO-0035](tasks/JUNO-0035.md) and [JUNO-0036](tasks/JUNO-0036.md) under parallel FIFO. Record bypasses in the assignment registry without changing the established provider order.

[JUNO-0045](tasks/JUNO-0045.md) coordinates the maintainer-authorized maintenance of the remaining PRs alongside V2. Functional and policy ordering remains unchanged.

## Completed and cancelled records

See the [history index](history/README.md). IDs are never reused.

## Independent review readiness

[JUNO-0039](tasks/JUNO-0039.md) tracks the maintainer review preparation and reproducibility check. Implementation retains its existing review gates and owners.

## GitHub traceability maintenance

[JUNO-0040](tasks/JUNO-0040.md) tracks retrospective issue and PR associations and their permanent workflow. The [traceability index](traceability.md) links historical work and registered tasks. The existing queue remains authoritative.

## Reproducible review correction

The maintainer's independent PR #40 findings authorize a parallel correction without changing product dependencies or provider order. In registered order: [JUNO-0041](tasks/JUNO-0041.md) isolated review tooling, [JUNO-0042](tasks/JUNO-0042.md) build provenance and review protocol, and [JUNO-0043](tasks/JUNO-0043.md) runtime information UI. [Reservations and dependencies](agents/ASSIGNMENTS.md#reproducible-review-and-runtime-identification) govern parallel work.

## Advanced harness intervention

The maintainer explicitly prioritized [JUNO-0055](tasks/JUNO-0055.md) over new product and branding work. Track adoption separately from review-stage deliveries.
