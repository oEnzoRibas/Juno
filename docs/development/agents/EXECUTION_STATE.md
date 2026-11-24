# Agent execution checkpoints

This record complements the [authoritative assignments](ASSIGNMENTS.md). Agent 01 records the last observed session state, its source, the last acknowledged registry revision when known, and the latest repository checkpoint. A task's delivery state can advance through a separately observed isolated execution while an independent Codex session remains interrupted or ended.

| Agent | Last independent session state | Last published task checkpoint |
| --- | --- | --- |
| JUNO-AGENT-01 | Owner instruction received. Executed the OpenAPI task and published its result. | JUNO-0036, [PR #29](https://github.com/oEnzoRibas/Juno/pull/29), `6706bb5628269556f0737757128b232725fd6882), awaiting review. |
| JUNO-AGENT-02 | Initial inspection ended, as reported by the owner. The later published checkpoint acknowledges registry `056183165bced5339c66b4c0674fc70bcf599a8e` and the #29 API contract. Current execution for the next task is unverified. | JUNO-0035 awaits review in [PR #30](https://github.com/oEnzoRibas/Juno/pull/30) at `15219bb0f001feb0b370c4d84ec2a31f5c431f83`. JUNO-0023 is assigned and is unacknowledged. |
| JUNO-AGENT-03 | Initial validation was manually interrupted, as reported by the owner. Awaiting separate resumption. No later independent-session acknowledgement is verified. | The isolated execution acknowledged [registry revision 0561831](https://github.com/oEnzoRibas/Juno/blob/056183165bced5339c66b4c0674fc70bcf599a8e/docs/development/agents/ASSIGNMENTS.md) and delivered local checkpoint `fed91526ff2624260d174864d0072005dff0a400`, with Compose, SQL regressions, Playwright and cleanup passing. The worktree later showed uncommitted runner changes. Preserve them and let the assigned owner reconcile and validate that follow-up before publication. |

When resuming Agent 02 or 03, supply the exact revision of [PR #28's coordination branch](https://github.com/oEnzoRibas/Juno/pull/28), the assigned task row, and the matching handoff. Check local status and publication history first. Record the recipient, acknowledgement source and revision. The owner will send independent-session resumption instructions.
