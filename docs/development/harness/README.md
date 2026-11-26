# Juno agent harness

Juno's development harness coordinates the tools and evidence used by its three persistent agents. This is a development-only change proposed in [ADR-0014](../../architecture/adr/0014-agent-harness.md) and tracked in [JUNO-0046](../tasks/JUNO-0046.md) and [issue #117](https://github.com/oEnzoRibas/Juno/issues/117).

- [Pre-intervention baseline](baseline.md) pins the existing architecture and incidents.
- [Capabilities and permissions](capabilities.md) records what was observed and what depends on the workstation.
- [Skill catalog](skills.md) defines activation and overlap.
- [Editable architecture view](../../architecture/diagrams/development/juno-agent-harness.md) links the Draw.io source and exports.

## Roles and use

| Owner                           | Start with                                                                                                                                         | Enlist a temporary specialist when                                                                         |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Agent 01, Core and Architecture | Read the queue and registry, publish an exact task claim, and invoke the applicable workflow or backend skill. Coordinate release and merge order. | An ADR, integration, API, database or permission boundary needs a bounded second analysis.                 |
| Agent 02, Product and Design    | Pin the V2 references and use the product or visual QA skill. Use the verified Photoshop route for an authorized creative task.                    | A review needs focused accessibility, visual judgment, original character design or native PSD inspection. |
| Agent 03, Platform and QA       | Pin the published revision, provision a disposable review environment if applicable, and publish independent observations.                         | An isolated verification needs specialized browser, infrastructure, regression or evidence analysis.       |

A temporary specialist has a deliverable and scope rather than registry ownership. Supply the task ID, base and head, reserved paths, relevant skill, output format and exact stop condition. A delegated implementation does not own its independent review. Use the applicable parent-session permissions. An assigned backlog item and an observed running session have separate records.

## Migration and gates

1. Publish the baseline, ADR, diagrams and registry. Record acknowledged handoffs separately from ownership.
2. Deliver shared, backend, frontend/design and platform skills as focused increments. Start independent scopes from their verified base while governance is under review. Put genuine shared dependencies in a native stack when available.
3. Review project-scoped custom profiles against the installed Codex schema. Keep personal tool configuration outside Git.
4. Qualify Photoshop in an isolated creative workspace. Participate in concept review before any official mascot master is released. Choose the smallest reliable local interface once the proof exists.
5. Check the incident corpus and run matched fresh sessions. Preserve inputs, skill versions, raw sanitized responses and scoring in the independent Research workflow. Record approval as a separate human observation.
6. Reconcile actual PR outcomes, rollout notes and the queue after review. Preserve historical worktrees and UAT snapshots. Changes advance to main by maintainer-controlled merge.

## Deterministic checks

Reuse the review launcher for exact Git refs, synthetic Compose, and safe teardown. Reuse the build stamp and schema metadata to identify the running app. The Compose validator owns fixture execution and browser results. Formatting, type checks, tests and secret scanning remain in the existing CI. Harness tools validate coordination structure and research artifacts. They do not replace these authoritative checks.

Keep context lean by loading one relevant skill and only the linked material the task needs. Checkpoint before a long handoff, tool change or interruption. On resumption, verify the checkout and latest evidence before following an old session summary.
