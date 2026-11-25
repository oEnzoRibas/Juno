# Stack #42 maintainer review intervention

On 2026-11-25 the maintainer independently ran the standard Compose validator on Windows with PowerShell and Docker. The following is the supplied evidence. The revisions are the review heads verified on GitHub. The provided logs do not independently attest the compiled image revisions or establish complete lint, TypeScript and Vitest outcomes. Human acceptance and merge authorization remain pending.

| PR | Review head | Playwright | SQL | Duration | Validator exit |
| --- | --- | --- | --- | --- | --- |
| #40 | `bcf3b5cdf54912ee19b9456e0e24c8cd9aba8184` | 7/7 | 3/3 | 6.6s | Not recorded |
| #41 | `122658a0950b3fffa70963e94d2ecd099d5c41a3` | 7/7 | 3/3 | 9.8s | 0 |
| #45 | `6b66972d89159b1746ecac7b0c44365864465fca` | 8/8 | 3/3 | 11.9s | 0 |
| #49 | `6f5c65681ed3f54df189d2f7760ba508cea929cf` | 8/8 | 5/5 | 9.5s | 0 |

The earlier independent #40 report described 6.5s and 538ms for the directory case. Preserve both observations with their original evidence; the stack submission reports 6.6s. Original hosted results and agent checks remain distinct, including the [original #40 incident record](https://github.com/oEnzoRibas/Juno/blob/6b4a59aa998f6d7ca7d8416e6ce81b0abe7a254d/docs/development/history/JUNO-0042-pr-40-runtime-review.md).

| Severity | PRs | Root cause and correction |
| --- | --- | --- |
| High review coverage gap | #40, #41, #45 | The standard runner explicitly listed three baseline SQL fixtures. Register directory in #40, keep the expanded fixture at #41, add profile in #45. The #49 historical run grants integrated coverage but does not independently exercise earlier heads. Preserve onboarding-audit and execute each fixture once. |
| High test reliability gap | #45, #49 | #49 provisioned a separate account, but the backend profile consumer used primary credentials and Shell had no consumer in stack #42. Provision and consume mandatory distinct profile credentials in #45, and consolidate checks in #49. Authentication limits are outside this correction. |
| High transactional evidence gap | #45 | Equal responses alone did not establish audit idempotency. Use actual concurrent API requests and query the persisted profile and audit count after both terminate. Keep the separate SQL rollback fault assertion. |
| Medium scenario visibility gap | #40, #41, #45, #49 | A Playwright case summarized multiple access assertions. Record safe names, actors, targets, expected and actual statuses and results. Add SQL notices after assertions. Keep generated evidence outside Compose storage. |
| Medium review provenance gap | All | Historical images lack baked source metadata. Rebuild a uniquely named project from the pinned clean worktree, print checkpoint and running image IDs, and probe actual API readiness. Do not treat worktree evidence as immutable image metadata. |

Implementation and current evidence are on [#40](https://github.com/oEnzoRibas/Juno/pull/40), [#41](https://github.com/oEnzoRibas/Juno/pull/41), [#45](https://github.com/oEnzoRibas/Juno/pull/45) and [#49](https://github.com/oEnzoRibas/Juno/pull/49). [Issue #110](https://github.com/oEnzoRibas/Juno/issues/110) links the corrective revisions, independent validation, reports and remaining review requirements. Original contributor authorship and original PR history are preserved.

Original project creator: Enzo Ribas. Developed with AI assistance.
