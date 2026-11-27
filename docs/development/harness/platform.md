# JUNO-0050 platform harness skills

[Harness initiative and acceptance criteria](https://github.com/oEnzoRibas/Juno/issues/117).

## Assignment and scope

Agent 03 owns the two skills below and this checkpoint in [PR #118](https://github.com/oEnzoRibas/Juno/pull/118). The original release was pinned to `a75e7dcca90d4868302e0b558da29d48f643a4fe`. Agent 00 coordinates the current review using the [coordination protocol](../agents/PROTOCOL.md).

| Skill                                                                               | Use                                                                                                           |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [Juno Review Environment](../../../.agents/skills/juno-review-environment/SKILL.md) | Build, inspect, test or recover an isolated exact-head or explicitly pinned composed review.                  |
| [Juno Independent Review](../../../.agents/skills/juno-independent-review/SKILL.md) | Qualify a candidate, check real runner coverage, and report independent evidence against the proper revision. |

The skills use the existing [review launcher](../../../scripts/review/README.md), [provenance guide](../../testing/juno-review-runtime.md), [Compose validator](../../../scripts/quality/validate-compose.mjs), and structured Playwright reporter. They take the expected schema and required fixtures from the reviewed revision, then use its runtime receipts to verify the connected schema and actual fixture execution.

## Baseline after directorates

[PR #133](https://github.com/oEnzoRibas/Juno/pull/133) merged at `778e62514e688d6d2e67247ff7638147fbf0b4f5`. On the synchronized main baseline `c83a5469bd6250ffab595cee1653740db308c1e1`, migration `0008_organization_directorates` records application schema 9. The Compose runner registers six SQL fixtures in order: tenant isolation, invitation expiry, onboarding audit, member directory, organization profile, and directorates. The directorate SQL tests scoped access, audit visibility and rollback on audit failure. Playwright checks concurrent creation for one success and one conflict, and the validator then queries PostgreSQL for one directorate and one audit event attributed to the expected actor. These expectations describe this baseline. Future reviews inspect their own candidate's runner and migration history.

## Original skill validation

- The bundled skill creator's `quick_validate.py` passed on both skill directories. Local links and the repository's pinned formatter were checked on the delivered files.
- Codex CLI 0.169.1 app-server `skills/list` with `forceReload: true` returned both skill names with `scope: repo`, `enabled: true` and a path under the review worktree. This read-only probe used `initialize`, `initialized` and `skills/list` against the local app-server stdio transport. It sent no model turns and performed no installation or configuration writes.
- Explicit invocation in a model-backed turn, implicit matching and model behavior were not exercised. No separate session, global installation, or paid API call was used for this checkpoint. A merged repository eval, where available, remains separate from this skill-discovery result.
- Maintainer review scenarios are a pinned disposable PR run, a review stop refused because the checkout contains edits, and independent validation of an explicitly composed candidate with missing compiled provenance. Verify command selection and that evidence reports the actual revision, cleanup refusal, and missing provenance. The detailed workflow stays with the maintained tools linked above.

Original project creator: Enzo Ribas. Developed with AI assistance.
