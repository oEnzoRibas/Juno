# ADR-0004 — Durable domain events

| Field          | Value                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| Status         | Proposed                                                                            |
| Date           | 2026-11-24                                                                          |
| Decision owner | Enzo Ribas, with architecture and security review pending                           |
| Prepared by    | Codex, as AI-assisted decision preparation                                          |
| Related task   | [JUNO-0001](../../development/tasks/JUNO-0001.md)                                   |
| Related ADRs   | [ADR-0001](0001-tenant-data-isolation.md), [ADR-0003](0003-application-topology.md) |

## Context and problem

Validated reports, challenges, learning and integrations can qualify for recognition. A transaction that commits without durable delivery may leave a valid activity unrecognized. Retries and conflicting rule updates can issue duplicate or inconsistent awards.

## Drivers and requirements

Track tenant, stable event identity, typed business occurrence, version and provenance. Make awards idempotent per eligible source, recipient, tenant and rule policy. Preserve rule version, explanation and audit. Apply ordering only where an invariant requires it. Keep XP separate from spendable currency unless explicitly approved otherwise.

## Alternatives and trade-offs

- Synchronous application calls couple the producer and consumer but can share a transaction. Suitable for short, required invariants.
- In-memory notifications are simple but lose pending delivery on process failure. Use only when losing delivery is acceptable.
- A relational transactional outbox records events in the same transaction as business changes. It adds processing, retry, monitoring and cleanup responsibilities.
- An external broker offers separate capacity but introduces delivery and operating complexity. Revisit only after a measured need.

## Recommendation and rationale

Evaluate a PostgreSQL-backed outbox if separate processing must survive failure. Keep balance, ledger, stock and redemption changes in one transaction. Process outbox events at least once with persisted idempotency, bounded retries, authorization, and scoped replay. Adapters translate provider signals into validated domain events. Candidate event names include PullRequestMerged, CodeReviewValidated, CourseCompleted, ReportApproved, ChallengeValidated, AchievementUnlocked, ExperienceAwarded, CurrencyAwarded and RewardRedeemed.

## Consequences

Committed events survive a worker crash and decouple integration intake from rules. Consumers need tenant-scoped deduplication, monitoring of backlog and failure, retention, and operator-controlled replay. Minimize event payloads. When adopting the pattern, introduce the outbox and consumers before enabling producers. Reconcile durable events before rolling back a consumer.

## Validation strategy

Test transaction rollback, crash before acknowledgement, duplicate and out-of-order events, cross-tenant replay denial, rule changes, concurrent awards, retention, and safe retry. Verify affected states and audit evidence. See [economy rules](../../product/gamification.md) and the [Transactional Outbox pattern](https://microservices.io/patterns/data/transactional-outbox.html).
