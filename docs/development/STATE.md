# Development state

**Checkpoint:** 2026-11-24. The maintainer accepted UAT commit `5a8947feceab0867d9ba81c3d3a163200ff8c1cf` and explicitly approved the corresponding integration. The running preview is preserved.

**Integrated main:** `3053a7beab1ec657305634c77df46efe4ec472f1`. The authorized coordination, runtime, and design PRs were integrated. #36 audit runner follow-up, #37 shell and #38 UAT documentation remain open and separate from that authorization.

The [organizational cycle handoff](agents/agent-01/handoffs/juno-organizational-cycle.md) supersedes the historical checkpoint. It pins the corrected pull requests, local preview and per-agent work. Main was revalidated with frozen install, lint, typecheck, four Vitest tests, six browser tests, SQL isolation and invitation regressions, and Compose smoke and migration rerun. The original UAT remains on ports 3300 and 4300. The separate shell candidate uses ports 3301 and 4301. Human acceptance is pending for the shell candidate.

Completed [directory query and profile API](agents/agent-01/handoffs/juno-organizational-cycle.md) as review-stage increments. The [integration record](history/JUNO-0034-shell-candidate.md) preserves exact test and recovery evidence. Continue independent QA and frontend from the released revisions. Core lifecycle transitions and delegated roles need policy before implementation.
