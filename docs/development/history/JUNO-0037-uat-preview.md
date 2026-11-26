# UAT preview checkpoint

**Date:** 2026-11-24. **Local Git branch:** `preview/juno-uat`. **Preview commit:** `5a8947feceab0867d9ba81c3d3a163200ff8c1cf`. **Tree:** `fbd119f38e916c924c614700e35b78d7773e1fe5`. **Running application input commit:** `0c7b49a0e0d12c981fe60f352b1f166d05dfeb5e`. The later preview commit adds the already validated #36 audit runner and its documentation without changing application or container build inputs.

| Pull request                                      | Included head                              |
| ------------------------------------------------- | ------------------------------------------ |
| [#22](https://github.com/oEnzoRibas/Juno/pull/22) | `cb505b2271c76fe9506bd9c10bcfc7a05f674a2a` |
| [#23](https://github.com/oEnzoRibas/Juno/pull/23) | `30f7e884e69ad5b8ca4c30412b0173e7106fed34` |
| [#24](https://github.com/oEnzoRibas/Juno/pull/24) | `114a26f9a74694bbf7c62e06406f926e9b120f9b` |
| [#26](https://github.com/oEnzoRibas/Juno/pull/26) | `678577cc7305d5c90036dfc3fbf9e1ed08805ab0` |
| [#27](https://github.com/oEnzoRibas/Juno/pull/27) | `9f3b01768f297e2113fe198f423d90d983029b69` |
| [#29](https://github.com/oEnzoRibas/Juno/pull/29) | `efc97bbf9172568ce2fea9ab44efa682cb0e5e07` |
| [#31](https://github.com/oEnzoRibas/Juno/pull/31) | `ea14d2eb8d17671f2e44b886ebdd617cf2d5068d` |
| [#33](https://github.com/oEnzoRibas/Juno/pull/33) | `0e28185e918d7f745b95e98037851c1a69aa377c` |
| [#34](https://github.com/oEnzoRibas/Juno/pull/34) | `0b31c5e22e7d64488340f454f6d6bf67d6d7f302` |
| [#35](https://github.com/oEnzoRibas/Juno/pull/35) | `47bef97ba2bce4b4cf7123af8ac9148dfb41dc7a` |
| [#36](https://github.com/oEnzoRibas/Juno/pull/36) | `85bc9c2fb5bac2e762fa8d8b7579708a3b34287c` |

Both composed trees were conflict-free. The frontend used the design candidate with no changes to API or Compose. The #36 follow-up changed only the runner and related records. The Application Shell and broader organization management are outside the snapshot.

Compose project `juno-uat` serves the frontend at `http://127.0.0.1:3300` and API at `http://127.0.0.1:4300`. PostgreSQL is attached to an internal network without a host port. Schema version 5 was verified. Existing operational endpoints created two fictional organizations, six accounts, six active memberships and two pending invitation links. The local Windows account controls the secrets.

Frozen install, lint, type checking, four Vitest tests, six Playwright cases, Docker builds, readiness, migration rerun and PostgreSQL tenant and invitation policy checks passed on the composed application. A browser smoke using the persistent UAT fixtures confirmed both languages and themes, scoped access, dual membership and redacted audit. The maintainer acceptance decision is pending.

The final preview tree also passed the third SQL regression for redacted onboarding audit and the complete six-case browser suite using the #36 runner. The persistent UAT database was preserved. A non-destructive backup check verified a readable PostgreSQL archive.

The maintainer accepted this exact snapshot on 2026-11-24. See the [acceptance and integration record](JUNO-0037-maintainer-acceptance.md).
