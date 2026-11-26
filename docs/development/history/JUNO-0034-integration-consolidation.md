# Integration consolidation

## Maintainer validation of database recovery

On 2026-11-24 the maintainer reported that they independently executed the database recovery validator from [PR #44](https://github.com/oEnzoRibas/Juno/pull/44). They observed successful recovery, data preservation, migration integrity, and cleanup of the disposable environment. The reviewed PR head was `8ac2b9444c7fe078f906b1f8b8d63b2c91812671`. GitHub reports merge commit `c93ca1c7a372396cce1880b01d55171db3262a84`. The report did not specify the command output, environment configuration, or individual HTTP statuses. Maintainer observations complement the validator's separately recorded automated assertions and do not cover the backup and restore successor.

PRs #38 and #39 were also merged by the maintainer. Their merge commits `09c5c8a` and `8c7ab45` precede #44 on main. The original UAT and the Application Shell UAT retain their original commits and PostgreSQL volumes.

## Batch review order

This section records the original integration planning checkpoint and its then-open review gates. See the [remaining review checkpoint](#remaining-review-checkpoint) for the current stack state.

| Batch | Reviews | Eligibility |
| --- | --- | --- |
| A | #46, backup and restore | Independent on integrated main. The rebased branch at `ef8a1dfc2c44779721de3daf187ac40e561dbc47` has green hosted checks. #44 approval covers the recovery validator only. |
| B | #36, then #37 | Both are mergeable against current main with green hosted checks. Preserve the existing Shell acceptance gate and exact tested revisions. The next UAT includes both. |
| C | #40 → #41 → #45 → #49, then #43 → #48 → #51 | [Backend and quality stack #42](https://github.com/oEnzoRibas/Juno/stack/42) and [frontend stack #50](https://github.com/oEnzoRibas/Juno/stack/50) represent separate ancestry. #43 needs #40, #48 additionally needs #41, and #51 additionally needs #45. Reconcile the #36/#49 fixture list and refresh hosted validation. After #37 and the necessary API commits land with approval, Agent 02 should retarget or replay the frontend stack on the common verified baseline. Each review needs a green hosted Compose result. |
| D | #52 | Review mechanical formatting after the functional batches so it runs against the accepted tree. See the formatting cutover below. |

Live GitHub metadata and local three-way merge calculations show #36, #37, #40 and #52 are currently mergeable against `main` at `c93ca1c7a372396cce1880b01d55171db3262a84`. Their scope is three, 17, ten and 152 files respectively. No branch rewrite is needed to resolve the reported conflict signal. The frontend hosted failures have a different cause: the sibling REST contract is absent in the merge ref. #36 and #49 genuinely overlap in the disposable runner. The Organization preview reconciles that list by retaining all five distinct fixtures. No update to a published QA head is needed until the authorized integration sequence supplies the new base.

## Formatting cutover

Keep the formatter configuration, pinned package and CI gate separate from the mechanically rewritten files. Reuse the protected file rules in #52. Preserve applied migrations and generated Drizzle metadata byte-for-byte. Preserve original artwork and exported SVG, Draw.io, PDF and other binaries. Keep the package manager's generated lockfile stable except for the intentional formatter dependency.

After the functional batches have converged, let Agent 03 regenerate the formatting changes against the accepted main and review the scoped diff. Keep formatting separate from application changes when replaying pending branches. Once the baseline receives approval and lands, update `AGENTS.md` to require `pnpm format:check`, `pnpm lint`, applicable type checks and automated tests. Link its instructions to the exact allowlist in the formatter documentation. Use Prettier for supported source, markup and configuration, and basic UTF-8, line ending, final newline and trailing whitespace checks for the remaining eligible editable text. Verify frozen install, formatting idempotence, artifact exclusions, CI, and disposable migration and smoke checks before changing the common base.

The live formatting rehearsal on current main found three #44 files that fail the gate. Running the pinned formatter changed exactly those three files and made the gate pass. Combining the stale mechanical patch with the organization candidate would conflict in four functional source or QA files. Reapply tooling and regenerate mechanical changes from the accepted functional tree instead.

The local regeneration at 4c180189ba119d8ccf75d952457d15c07dd6dfa1 separated tooling, 179 mechanical changes, and the CI gate. Frozen install, formatting, lint, type checks and four unit tests passed. The mechanical commit did not touch any applied migration, generated metadata, lockfile, Draw.io master, SVG export or binary asset. The only lockfile addition comes from the formatter tooling commit.

## Remaining review checkpoint

On 2026-11-25, `main` at `1bed5952bc121b45d2be4e998ae1d256473919e9` includes #46 backup and restore, #36 audit regression, #57–#60 self-hosting, the corrected [backend stack #42](https://github.com/oEnzoRibas/Juno/stack/42), #54 historical frontend evidence, #111 V2 coordination and #109 isolated review tooling. Stack #42 integrates the member directory, filters/detail, profile writes and schema-8 validation with all five SQL fixtures, dedicated profile identity and structured browser checks. [JUNO-0044](JUNO-0044-stack42-review.md) separates the maintainer's original observations from corrective QA and hosted evidence.

The historical [Organization candidate](../uat-organization-candidate.md) and [#54 evidence](https://github.com/oEnzoRibas/Juno/pull/54) record their original composition. The maintainer's approval of the V2 playground authorizes application implementation. V2 runtime acceptance and merge approval remain pending. Agent 02 retains the live #37 and the subsequent [stack #50](https://github.com/oEnzoRibas/Juno/stack/50) adaptation after a stable independent QA release. Agent 03 owns #55 and the formatting refresh. [JUNO-0045](../tasks/JUNO-0045.md) tracks scope and current status.

#106 and #107 keep their independent [stack #108](https://github.com/oEnzoRibas/Juno/stack/108). Use the merged launcher only on a checkout that contains it. OCI provenance requires the new archive provider in the selected revision. Existing historic images retain their previous evidence and limitations. Rehearse V2 composition separately before visual acceptance of the runtime indicator.

#52's current conflict paths include the runtime module, ADR index, assignments, root package manifest and schema-8 Compose runner. Preserve the historical formatter commits. When the functional baseline stabilizes, synchronize with the then-current main, keep functional source and regenerate a separate mechanical commit. Validate protected blob IDs, the pnpm lockfile, formatter idempotence and demonstrated failures, workspace tests, fresh Compose and CI. The repository-wide formatting pass is deferred to that checkpoint.
