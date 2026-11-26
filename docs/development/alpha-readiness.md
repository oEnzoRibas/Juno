# Proposed v0.1.0-alpha readiness

The first approved UAT snapshot demonstrates authenticated tenant onboarding and the existing design baseline. Record later acceptance against separately pinned changes.

| Area                       | Remaining evidence                                                                                                                                                                                                                                            |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Functional                 | Validate the application shell and its role-aware navigation. Advance organization management in FIFO order after the shell prerequisite. Confirm the first alpha's member and organization scope with the maintainer.                                        |
| Authorization and security | Independently verify current tenant policies and audit regressions on the integrated runtime. Review sensitive logging, dependency findings, supported deployment boundaries, audit retention and delegated-access decisions before including those features. |
| Documentation              | Keep the English operator, onboarding and OpenAPI guides, migration and recovery notes, known limits and editable architecture exports in sync with the selected scope.                                                                                       |
| Integration and validation | Integrate only approved scope. Verify the exact main tree, Actions, disposable Compose, PostgreSQL migration, browser and authorization regressions. Establish a separately pinned UAT candidate for post-acceptance changes.                                 |
| Release governance         | Human release approval, final release notes and an explicit tag decision remain pending. See the [release process](../governance/release.md).                                                                                                                 |

Track task readiness in the [queue](QUEUE.md) and the [agent registry](agents/ASSIGNMENTS.md).
