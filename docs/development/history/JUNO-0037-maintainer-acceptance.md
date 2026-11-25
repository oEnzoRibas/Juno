# Maintainer acceptance and integration

## Human acceptance

On 2026-11-24, the project owner reported personally testing and approving all demonstrated functionality and visual behavior in the running UAT preview. No individual scenario observations were supplied. This records approval for the exact [UAT checkpoint](JUNO-0037-uat-preview.md), `5a8947feceab0867d9ba81c3d3a163200ff8c1cf`, and the explicit authorization to merge the listed integration set.

The preview used Docker Compose project `juno-uat` on Linux amd64 containers on Windows. Next.js and Nest exposed loopback ports 3300 and 4300. PostgreSQL schema version 5 ran on a private network without a host port. It contained two fictional organizations, six accounts, isolated membership roles and pending synthetic invitations. The owner credential store and data remain local. The accepted application input was `0c7b49a0e0d12c981fe60f352b1f166d05dfeb5e`. The later tooling-only commit included the #36 QA runner.

## Integration on 2026-11-24

GitHub merged #32 independently, then atomically merged the contiguous native stack #14 by rebase, then merged #33 separately by rebase. The final integrated main tree `04d082b32921494d5395a4e5547ec4f1d81e1a3b` matched the preflight composition. Application and workflow build inputs matched the accepted runtime candidate. #32 was explicitly authorized as coordination and had no runtime inputs. #36 was tested as tooling in the preview and was not included in the separate merge authorization.

| Integration order | Approved PR head | Result on main |
| --- | --- | --- |
| [#32](https://github.com/oEnzoRibas/Juno/pull/32) | `6a3b9e3a87fd7a087eebaa3cb338fa0e55d2c1c3` | `fe837cb948680f58be4af90aef1b123d79f374bb` |
| [#22](https://github.com/oEnzoRibas/Juno/pull/22) | `cb505b2271c76fe9506bd9c10bcfc7a05f674a2a` | `4b4a502e67d9e07c8fc560ba3860bdfab7ea5bd8` |
| [#23](https://github.com/oEnzoRibas/Juno/pull/23) | `30f7e884e69ad5b8ca4c30412b0173e7106fed34` | `fec87b6a81a388304655eab8f4acc96ca5d4b63b` |
| [#24](https://github.com/oEnzoRibas/Juno/pull/24) | `114a26f9a74694bbf7c62e06406f926e9b120f9b` | `b8fe873b309b88e7c02997a52cc704ce77e683fc` |
| [#26](https://github.com/oEnzoRibas/Juno/pull/26) | `678577cc7305d5c90036dfc3fbf9e1ed08805ab0` | `16c7da3411a4101a9173a73f6c2cdf932852ea99` |
| [#27](https://github.com/oEnzoRibas/Juno/pull/27) | `9f3b01768f297e2113fe198f423d90d983029b69` | `476f4057e08ae4931e9aa2f23dec9f007aca2402` |
| [#29](https://github.com/oEnzoRibas/Juno/pull/29) | `efc97bbf9172568ce2fea9ab44efa682cb0e5e07` | `5d2d9cd819d012b569f7d63232a7e97192a7eed5` |
| [#31](https://github.com/oEnzoRibas/Juno/pull/31) | `ea14d2eb8d17671f2e44b886ebdd617cf2d5068d` | `bf5aeac6ffc09f6ef24d6cf6be80b95dac5dd04f` |
| [#34](https://github.com/oEnzoRibas/Juno/pull/34) | `0b31c5e22e7d64488340f454f6d6bf67d6d7f302` | `88176613062139c16d0c7ae1f347ca52d72cf84e` |
| [#35](https://github.com/oEnzoRibas/Juno/pull/35) | `47bef97ba2bce4b4cf7123af8ac9148dfb41dc7a` | `e479e680a42bdc7efd69b20e660123de83c515c8` |
| [#33](https://github.com/oEnzoRibas/Juno/pull/33) | `0e28185e918d7f745b95e98037851c1a69aa377c` | `3053a7beab1ec657305634c77df46efe4ec472f1` |

The refreshed #33 head was `779c43873eeb1f827c3d11b07f5563a1ba7371b9`. Its complete incremental binary diff, three commit messages and author metadata matched the accepted design head. The exact lease and `refs/juno-recovery/20261124-uat-integration/pr-33` preserve the prior checkpoint. Both rerun workflows passed before the final merge.

## Automated validation

The frozen accepted preview passed Compose builds, migration and rerun, HTTP health and OpenAPI, three SQL regressions, six browser scenarios and four Vitest tests. Browser coverage included locale and theme support, keyboard and responsive design, onboarding, activation, role authorization and tenant denial.

The final main commit `3053a7beab1ec657305634c77df46efe4ec472f1` passed both [GitHub Actions jobs](https://github.com/oEnzoRibas/Juno/actions/runs/45461964074). Independently, its local checkout passed frozen installation, lint, type checking, four Vitest tests and a disposable Compose run with startup, readiness, fresh and repeated database migration, tenant and invitation SQL checks and six Playwright scenarios covering authentication, onboarding, audit, authorization and design. The final integrated diff passed whitespace and redacted Gitleaks checks. The UAT database remained healthy and was preserved.

## Security and limits

The automated results include tenant and audit authorization regressions and a secret scan. They do not record a comprehensive security review or production approval. The separate shell, audit-fixture runner follow-up, broader organization management and production validation remain outside the approved merge. See the [alpha readiness notes](../alpha-readiness.md).
