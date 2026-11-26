# Development state

**Checkpoint:** 2026-11-25. The maintainer approved the Design System V2 playground at `7e434d664e8ad02963684406efd6932fd11b2663`, releasing Agent 02 to implement it in the existing #37. Application acceptance remains pending. Current main `f527519b0f944631131a8464ce67d9662745ffde` contains the corrected organization backend stack and schema-8 suite. Agent 03 owns independent QA. The dependent frontend branches are reserved until the V2 implementation pin is released. See the [V2 handoff](agents/agent-01/handoffs/juno-0027-v2-implementation.md).

The [PR #40 review correction](history/JUNO-0042-pr-40-runtime-review.md) records the earlier `37cc0a9e0b9f1c5f240b02cccb1aa84fb183b2ad` checkpoint and exact source evidence. At integration base `1bed5952bc121b45d2be4e998ae1d256473919e9`, the #109 launcher is integrated. The archive provider and the optional UI remain separate review deliveries under the [ownership release](agents/ASSIGNMENTS.md#reproducible-review-and-runtime-identification). Retain all accepted and in-review UAT snapshots.

The foundation UAT at `5a8947feceab0867d9ba81c3d3a163200ff8c1cf` was accepted on 2026-11-24. Its snapshot and acceptance remain preserved. #36 and #38 are integrated. #37 is open.

The [organizational cycle handoff](agents/agent-01/handoffs/juno-organizational-cycle.md) supersedes the historical checkpoint. It pins the corrected pull requests, local preview and per-agent work. Main was revalidated with frozen install, lint, typecheck, four Vitest tests, six browser tests, SQL isolation and invitation regressions, and Compose smoke and migration rerun. The original UAT remains on ports 3300 and 4300. The separate shell candidate uses ports 3301 and 4301. Human acceptance is pending for the shell candidate.

Completed [directory query and profile API](agents/agent-01/handoffs/juno-organizational-cycle.md) as review-stage increments. The [integration record](history/JUNO-0034-shell-candidate.md) preserves exact test and recovery evidence. Continue independent QA and frontend from the released revisions. Core lifecycle transitions and delegated roles need policy before implementation.
