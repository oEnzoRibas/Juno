# Organizational management and quality cycle

Released on 2026-11-24 under the maintainer's extended execution authorization. The repository branch `docs/juno-0034-integrated-assignments` in [PR #39](https://github.com/oEnzoRibas/Juno/pull/39) publishes the governing registry and this handoff. The commit that contains this file is the coordination revision. Work may consume the exact, unmerged dependencies below.

## Current pins

| Branch and purpose | Commit |
| --- | --- |
| `main`, integrated foundation | `3053a7beab1ec657305634c77df46efe4ec472f1` |
| `test/juno-0022-runtime-regression-coverage`, #36 | `7c17cc435d863e5b43c4a8302b2ad8ec730828eb` |
| `feat/juno-0027-application-shell`, #37 | `a7825a6b814013527414e7478fa77d5b2d3eb60c` |
| `feat/juno-0028-member-directory`, #40 | `7d7f7a447e56159bbdc7eb6587e7fcaaa564c23d` |
| `preview/juno-uat-shell-20261124`, local pre-acceptance composition of main + #36 + #37 | `33c3cc6c52e7cffccba982efeaaa6239f507def9` |

## Released work

| Agent and task | Branch and exact base | Exclusive paths | Acceptance and handoff |
| --- | --- | --- | --- |
| 01, JUNO-0028 directory lookup | `feat/juno-0028-member-lookup` from #40 exact head above | `apps/api/src/organization/**`, API database readiness, migration 0006 and journal, directory SQL and browser API regression, directory and migration documentation | Publish filtered list and single-member OpenAPI contracts, no-store responses, negative role and tenant tests, fresh and upgrade migration evidence. Link to the real #40 stack parent. Release the full head to Agents 02 and 03. |
| 02, JUNO-0028 directory interface | `feat/juno-0028-member-directory-ui` from #37 exact head above, with #40 exact contract pinned independently | `apps/web/src/app/workspace/[id]/members/**`, shell navigation helpers under `apps/web/src/app/(shell)/_components/**`, member-local copy/CSS, `tests/browser/member-directory-ui.spec.mjs`, Agent 02 handoff and scoped design docs | Implement administrator list, pagination, empty/error/loading states, role-appropriate navigation, EN/PT-BR, keyboard and narrow layouts. Target #37 as source parent. Test #37 + #40 in isolated composition and list both review dependencies. Keep member API and QA harness untouched. |
| 03, JUNO-0022 independent shell QA | Detached validation worktree at exact local preview revision above | QA report and Agent 03 acknowledgements. Disposable Compose validation only. | Validate fresh/rerun migrations, HTTP/OpenAPI, SQL, browser authentication/revocation, switching and neutral denial. Report independent observations and exact commit. Keep the maintainer databases out of QA. |

## Pre-authorized successors

| Agent and task | Base or dependency | Reservation and acceptance |
| --- | --- | --- |
| 01, JUNO-0028 organization profile | `feat/juno-0028-organization-profile`, from the published directory lookup head once validated and pinned in this handoff | Organization API, migration 0007 and journal, organization profile SQL/browser tests and architecture docs. Keep the existing tenant slug and invitation scope. Limit changes to existing profile fields and the approved tenant administrator actor. Trace successful changes atomically and prove cross-tenant denial. Hold implementation if accepted constraints do not cover the write/audit policy. |
| 01, JUNO-0028 membership lifecycle | Wait for a decision on reactivation, administrator protection, delegation and historical retention | Agent 01 owns API and database semantics. Publish explicit activation/deactivation actor and state transitions before any writable UI. Directorates and teams need confirmed structure and delegated permissions. Projects and subprojects follow those foundations. |
| 02, JUNO-0028 lookup UI | `feat/juno-0028-member-lookup-ui`, after its directory UI head and API lookup head are independently published and pinned | Same exclusive member frontend paths plus member detail route, localized literal prefix, role and activation filters, and cursor reset. Integration smoke must use the exact directory lookup head and prove a regular or foreign user gets no member data. |
| 02, JUNO-0028 organization profile UI | The validated, published profile API contract and the active frontend branch head | `apps/web/src/app/workspace/[id]/settings/**`, dedicated profile UI spec and Agent 02 evidence. Use server-derived authority and existing name and theme primitives. Wait for the exact update contract. |
| 03, JUNO-0022 database recovery | `test/juno-0022-database-recovery` from `main` at the exact SHA above; start after the shell QA handoff | `scripts/quality/validate-database-recovery.mjs`, `docs/testing/juno-database-recovery.md`, Agent 03 task evidence. Use only a new uniquely named Compose project. Verify liveness stays available, readiness fails without PostgreSQL and recovers when the same database restarts. Check that migrations and representative synthetic data persist. |
| 03, JUNO-0022 backup/restore and directory SQL | `test/juno-0022-database-backup-restore` from the published recovery head (pin after release). A follow-up directory runner change needs the exact directory lookup head. | Dedicated backup/restore validator and QA docs. Verify a synthetic logical dump into a separate disposable destination and rerun tenant denial checks. When released, add the existing directory SQL fixture to the reusable runner, preserving implementation-test authorship. |

The next eligible task can start after the predecessor handoff and exact base pins are verified. Use a fresh lane worktree, and bring both contract pins to any cross-lane integration. Agent 01 controls manifests, lockfiles and the central registry. A branch assignment or published implementation does not establish that the owner's independent session is executing. Report acknowledgement, tests, blockers and final SHA separately.

## Delivery checkpoint

| Lane | Published result and successor |
| --- | --- |
| Agent 01 | Directory lookup [#41](https://github.com/oEnzoRibas/Juno/pull/41) `46b1a9408077d1a2564bdc403d158a8ebb294ec6`, based on #40. Profile update [#45](https://github.com/oEnzoRibas/Juno/pull/45) `b09f3224e94ecc8128c0d8ed77554f235db2f8a0`, based on #41. Both are in native stack #42. Membership lifecycle needs an agreed active/inactive transition, privileged account protection and retention rule. Directorate and team delegation and project assignments follow their product decisions. |
| Agent 02 | Directory UI [#43](https://github.com/oEnzoRibas/Juno/pull/43) at `e5de071650154641b9f08e7c0ba212d5e71def0a` for this checkpoint. The lookup UI branch is released on that revision with #41 pinned above. Verify the latest frontend handoff before starting. The shell and backend are genuine runtime dependencies. Validate in a composed environment. The profile UI may consume the exact #45 contract after the lookup UI handoff. |
| Agent 03 | Independent shell review and database recovery [#44](https://github.com/oEnzoRibas/Juno/pull/44) at `8ac2b9444c7fe078f906b1f8b8d63b2c91812671`, main base. The backup/restore successor is released from that exact head. For follow-up SQL integration use #45's schema 8 candidate, scope runner and evidence files to Agent 03, and include directory search/detail and the profile isolation and audit fixtures. |

The [integration record](../../history/JUNO-0034-shell-candidate.md) records recovery, hosted checks, and the separate proposed UAT. #43 target #37 is its source dependency. The #40 runtime dependency remains a separate approval and integration gate. The two API increments do not belong to the shell UAT snapshot.
