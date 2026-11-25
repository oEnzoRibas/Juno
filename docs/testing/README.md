# Testing strategy

**Status:** Proposed application validation. Phase 0 checks documentation, repository configuration and provenance. No application test runner exists.

| Level                          | Planned evidence                                                                                                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Unit                           | Permission policy and scope rules, dates and locale formatting, score and level rules, reward eligibility, and metric calculations.                                                                                |
| Persistence and integration    | Database constraints, migration recovery, audit writes, tenant-safe queues and storage, GitHub delivery replay, reconciliation, throttling, disconnect, and identity mapping failures.                             |
| API contract                   | Authentication requirements, tenant boundaries, error semantics, invalid references, idempotency, pagination and schema compatibility.                                                                             |
| End-to-end                     | Invitation, activation, membership deactivation, scoped organization administration, review and award, theme changes, and redemption.                                                                              |
| Security                       | Seed at least two synthetic tenants. Verify denied cross-tenant list, object, nested reference, mutation, export, audit, file, cache, integration and background access, including attempted delegated escalation. |
| Economy concurrency            | Race requests for the same balance and last item, replay requests after ambiguous outcomes, and race approval, cancellation and reversal. Reconcile balances, stock and ledger after each case.                    |
| Accessibility and localization | Combine automated checks with keyboard, screen reader, contrast, zoom and theme review. Run key flows in English and Brazilian Portuguese, including deadline boundaries.                                          |

Use deterministic synthetic fixtures, including different membership scopes for the same identity. Assert the resulting state after failed or denied requests. For providers, keep deterministic failure simulations in normal CI and run authorized sandbox contract checks separately when needed.

When a test runner is implemented, document exact setup and commands, fixture reset, required services, execution order and CI integration. Keep fast checks on pull requests and add longer validation as warranted. Report checks and skips with an explanation. See [contribution standards](../../CONTRIBUTING.md).

## Incremental quality gates

| Stage                                      | Automated gates to introduce when runnable                                                                                                                                                                 |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation and Git foundation           | Conventional Commit and PR title format, branch naming, formatting, documentation validity and broken links, Mermaid source validation, MIT consistency, and secret detection.                             |
| Language, workspace, and public interfaces | Lint, type checking, unit tests, dependency vulnerability checks, architecture dependency boundaries, API specification validation, reference generation and meaningful public API documentation coverage. |
| Persistence and identity                   | Repeatable migrations and recovery, integration tests, authorization and tenant isolation. Check pooled tenant state, denied metadata exposure, and scoped workers or exports.                             |
| Deployable flows                           | End-to-end tests, browser accessibility and locale checks, provider failure scenarios and concurrent economy behavior.                                                                                     |
| Container pipeline                         | Compose config, image builds, cold startup and health, migration gates, containerized tests, image and dependency vulnerability scans, secrets and SBOM generation.                                        |

Use GitHub Actions with the same containerized definitions as contributors when they are runnable. Evaluate GHCR for official image distribution through a separately authorized workflow. [GitHub Container Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry)

Give each gate a repository command, reproducible environment and expected result before enabling CI. Prioritize fast pull request checks and isolate slower provider tests. Document failures and obtain appropriate approval before suppressing an applicable gate. Keep mandatory unverified work incomplete under the [definition of done](../development/DEFINITION_OF_DONE.md).
