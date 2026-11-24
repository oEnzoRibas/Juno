# Post-UAT agent handoff

Integrated baseline: `main` at `3053a7beab1ec657305634c77df46efe4ec472f1`. The maintainer accepted local preview `5a8947feceab0867d9ba81c3d3a163200ff8c1cf`. The merge authorization applied only to #32, #22, #23, #24, #26, #27, #29, #31, #34, #35 and #33.

| Owner | Current assignment and exact base | Reserved paths and delivery |
| --- | --- | --- |
| Agent 01 | JUNO-0028 member directory, `feat/juno-0028-member-directory` from integrated main SHA above. The executable shell from #37 was previously validated and its scoped frontend patch composes with the integrated backend. | `apps/api/src/organization/**`, `apps/api/src/app.module.ts`, `apps/api/src/database/database.service.ts`, migration `0005_*` and journal, organization-specific SQL and browser regressions, and organization architecture docs. Deliver a paginated tenant administrator directory and independent access checks. |
| Agent 02 | JUNO-0027, #37 at `eba9c149d5fab7dcea416c05c8036b41858c4452`, previously based on the design head `0e28185e918d7f745b95e98037851c1a69aa377c`. Update the shell to integrated main SHA above using only commits after the old design boundary. | Existing shell-owned paths from the [shell handoff](juno-0027-shell-release.md). The rebase of the approved design branch changed the apparent GitHub diff. Preserve a recoverable shell ref, revalidate exact scope, then target main and run the shell checks. No backend changes are required. |
| Agent 03 | JUNO-0022, #36 at `85bc9c2fb5bac2e762fa8d8b7579708a3b34287c` with previous base `0b31c5e22e7d64488340f454f6d6bf67d6d7f302`. Use integrated main SHA above for the follow-up. | Existing `scripts/quality/**`, testing docs and Agent 03 records. Review the scope on the integrated base and rerun both workflow jobs. Preserve recovery commit `fed91526ff2624260d174864d0072005dff0a400`. |

Only the assignment owner may update their in-flight branch. A new PR or resumption requires the exact base verified against the remote. The released work needs no additional owner relay. The original review branches and existing local work remain available.

## Pre-authorized successor work

- Agent 01 may advance from the directory into a membership lifecycle change when the directory contract is validated. Use the delivered directory head plus the approved delegation and reactivation policy. Hold any role elevation or new delegation semantics until those decisions are available.
- Agent 02 may follow the validated shell with a member-directory UI under existing shell-owned routes and a dedicated browser spec. Start only when the Core directory OpenAPI contract is published and the registry pins its exact revision and file reservation. Preserve the shell role and accessibility conventions.
- Agent 03 may add the directory SQL test to the disposable regression runner after the fixture is published and the registry pins its base. Independent dependency and runtime review may proceed on the integrated main without modifying the other two lanes. Report findings and evidence separately from UAT acceptance.

See the [agent protocol](../PROTOCOL.md). Resume finished tasks from published checkpoints. An assignment or review-stage handoff does not establish active execution.
