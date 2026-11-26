# JUNO-0050 platform harness skills

[Harness initiative and acceptance criteria](https://github.com/oEnzoRibas/Juno/issues/117).

## Assignment and scope

Agent 03 acknowledges the JUNO-0050 release from Agent 01 at `a75e7dcca90d4868302e0b558da29d48f643a4fe`. The review branch is `docs/juno-0050-platform-skills`. This increment owns the two skills below and this checkpoint. Agent 01 owns shared harness configuration, evaluation, registry, and coordination. Separate independent verification of Agent 01 and Agent 02 increments follows their published refs under JUNO-0046.

| Skill                                                                               | Use                                                                                                           |
| ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [Juno Review Environment](../../../.agents/skills/juno-review-environment/SKILL.md) | Build, inspect, test or recover an isolated exact-head or explicitly pinned composed review.                  |
| [Juno Independent Review](../../../.agents/skills/juno-independent-review/SKILL.md) | Qualify a candidate, check real runner coverage, and report independent evidence against the proper revision. |

These skills use the existing [review launcher](../../../scripts/review/README.md), [provenance guide](../../testing/juno-review-runtime.md), schema-8 SQL contract and structured Playwright reporter. They preserve resource ownership and historical UATs. They add no executable infrastructure, packages, permission changes, or separate failure gates.

## Validation

- The bundled skill creator's `quick_validate.py` passed on both skill directories. Local links and the repository's pinned formatter were checked on the delivered files.
- Codex CLI 0.169.1 app-server `skills/list` with `forceReload: true` returned both skill names with `scope: repo`, `enabled: true` and a path under the review worktree. This read-only probe used `initialize`, `initialized` and `skills/list` against the local app-server stdio transport. It sent no model turns and performed no installation or configuration writes.
- Explicit invocation in a model-backed turn, implicit matching and model behavior were not exercised. No separate session, global installation, or paid API call was used for this checkpoint. A merged repository eval, where available, remains separate from this skill-discovery result.
- Maintainer review scenarios are a pinned disposable PR run, a review stop refused because the checkout contains edits, and independent validation of an explicitly composed candidate with missing compiled provenance. Verify command selection and that evidence reports the actual revision, cleanup refusal, and missing provenance. The detailed workflow stays with the maintained tools linked above.

Original project creator: Enzo Ribas. Developed with AI assistance.
