# Maintainer review checkpoint

On 2026-11-25 Agent 01 fetched current GitHub metadata, compared head, base, incremental changes, commits and check outcomes, and updated the existing open PR descriptions. Agent 02 verified proposal and browser captures. Agent 03 verified platform check scopes, historical bases and reproduction commands. The [testing inventory](../uat-testing-guide.md#review-environment-inventory) pins the environments. The new standards PR follows the batch as a standalone governance change.

| PR                                                | Pinned review head                         | GitHub base                               | Observed state |
| ------------------------------------------------- | ------------------------------------------ | ----------------------------------------- | -------------- |
| [#37](https://github.com/oEnzoRibas/Juno/pull/37) | `3101ac7a26e2b621d32c996138f8dc33f7d52cae` | `main`                                    | CLEAN          |
| [#40](https://github.com/oEnzoRibas/Juno/pull/40) | `7d7f7a447e56159bbdc7eb6587e7fcaaa564c23d` | `main`                                    | CLEAN          |
| [#41](https://github.com/oEnzoRibas/Juno/pull/41) | `46b1a9408077d1a2564bdc403d158a8ebb294ec6` | `feat/juno-0028-member-directory`         | CLEAN          |
| [#43](https://github.com/oEnzoRibas/Juno/pull/43) | `e5de071650154641b9f08e7c0ba212d5e71def0a` | `feat/juno-0027-application-shell`        | DIRTY          |
| [#45](https://github.com/oEnzoRibas/Juno/pull/45) | `588489f6ef2ef7bb141d868d097f0761bcec8f65` | `feat/juno-0028-member-lookup`            | CLEAN          |
| [#48](https://github.com/oEnzoRibas/Juno/pull/48) | `145cb9f726cc8d34b2c4c416ef0c08624b6dd562` | `feat/juno-0028-member-directory-ui`      | UNSTABLE       |
| [#49](https://github.com/oEnzoRibas/Juno/pull/49) | `0a2bd92fa68c79e01cfbaff22bc8df3635be8d0a` | `feat/juno-0028-organization-profile`     | CLEAN          |
| [#51](https://github.com/oEnzoRibas/Juno/pull/51) | `fcd343c6c94242dfae9fbf78d7a3bcdc242c3087` | `feat/juno-0028-member-lookup-ui`         | UNSTABLE       |
| [#52](https://github.com/oEnzoRibas/Juno/pull/52) | `77249b39d5c769b2762dedd2ea88055032efdc0c` | `main`                                    | DIRTY          |
| [#53](https://github.com/oEnzoRibas/Juno/pull/53) | `ecc47b0abab408c590c7111dbec0a53f83752231` | `main`                                    | CLEAN          |
| [#54](https://github.com/oEnzoRibas/Juno/pull/54) | `7a142f7c8125261c578fe31251a1c8c38c432bc5` | `main`                                    | CLEAN          |
| [#55](https://github.com/oEnzoRibas/Juno/pull/55) | `e283f544bfeb4c95f9de25d8c5d039283bc88aa1` | `main`                                    | CLEAN          |
| [#56](https://github.com/oEnzoRibas/Juno/pull/56) | `164c14a6dd29d80e5b33453c8e9f99b786d312a4` | `main`                                    | CLEAN          |
| [#57](https://github.com/oEnzoRibas/Juno/pull/57) | `a73cfc18c1961551b1df804741434951cf8cf24a` | `main`                                    | CLEAN          |
| [#58](https://github.com/oEnzoRibas/Juno/pull/58) | `c91260a2a0e8ce2021f1ed5a29203d3b85dac2e8` | `docs/juno-0038-self-hosted-distribution` | CLEAN          |

Review #56 and documentary #53/#54/#55 separately. Decide membership policy independently of existing read-only features. Review #57 before #58 for production deployment. Review #37 in the redesigned UAT before aligning #43/#48/#51. Independently review #40 → #41 → #45 → #49 in the Organization UAT. #49 must preserve a single onboarding audit fixture when integrating with main. Frontend CI stays red until the required backends and Shell are present in the merge refs. Regenerate #52 after these functional reviews on the accepted base. No acceptance or merge is conferred by this checkpoint.

During the review audit, the redesigned Shell preview was briefly unavailable. Agent 01 restarted its already pinned Compose project without a build or volume reset and verified HTTP 200, readiness and schema 5. The review marker and credentials remain scoped to that preview.
