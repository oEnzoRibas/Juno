# Proposed roadmap

Phase exits describe review gates. Dates and staffing are open. See the [decision register](docs/product/decisions.md).

| Phase | Scope | Exit and dependencies |
| --- | --- | --- |
| 0. Project foundation | Governance, requirements, planning, threat model, design system | Owner reviews proposals and confirms artwork provenance, release readiness, and confidential reporting before public release. |
| 1. Platform foundation | Application and data baseline, authentication, scoped authorization, tenant provisioning | Accept architecture, identity, and tenancy ADRs before production implementation. Demonstrate two-tenant isolation, migration rollback or recovery, and a reproducible local and independent self-hosting setup. |
| 2. Organizational management | Members, configurable directorates, teams, roles, projects, subprojects, and assignments | Prove scope checks, tenant-specific structures, and preservation of authorized history after deactivation. |
| 3. Gamification core | Versioned scoring, XP, levels, achievements, activity, and recognition | Approve XP and currency relationship before implementation. Verify rule explanations, adjustments, visibility, and repeat awards. |
| 4. Challenges and reporting | Enrollment, evidence, review, manual reports, and approved activity | Demonstrate reviewer scopes, history, and one award per qualifying activity under default rules. |
| 5. Integration Hub and GitHub | Central tenant configuration, provider contracts, GitHub contributions, Projects sync, and eligible activity | Validate minimum permissions, identity mapping, disconnect, delivery replay, reconciliation, and metric interpretation. |
| 6. Virtual economy | Currency ledger, balance history, catalog, inventory, and redemption | Resolve cancellation and inventory policies. Pass parallel redemption and reversal checks and reconcile balances. |
| 7. Learning | Courses, video and playlist links, learning paths, assessments, and completion | Verify accessible content alternatives, documented completion signals, and one reward per qualifying completion. |
| 8. Advanced capabilities | SharePoint, Slack and Notion optional providers, advanced analytics, and operations | Approve provider access boundaries and analytics privacy thresholds before delivery. |

Introduce reusable localization and accessibility patterns with the first interfaces, and safe tenant branding with the first tenant-facing screens. GitHub permission discovery can run before Phase 5 once authorized. Manual reporting and recognition provide independent delivery paths. GitHub, GitHub Projects, YouTube, SharePoint, Slack and Notion are required optional roadmap capabilities. See the [catalog and rollout](docs/integrations/provider-registry.md).

The [Phase 1 implementation plan](docs/development/phase-1-implementation-plan.md) and [dependency graph](docs/development/phase-1-dependencies.md) identify the approvals, smallest runnable sequence, and provider-specific prerequisites.

The [self-hosted distribution milestone](docs/development/tasks/JUNO-0038.md) adds a hardened reference install, first-run guidance, and independently exercised backups and updates. Optional release images follow artifact review and explicit maintainer approval.
