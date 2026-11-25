# Product vision and requirements

**Status:** Planned. Juno helps independent Junior Enterprises organize work, recognize member contributions, and develop members' skills. A Junior Enterprise administers its own structure and policies. Core workflows must serve technical and non-technical members and remain useful without external integrations. Juno starts with the Brazilian Junior Enterprise movement and supports international adoption. The upstream project distributes MIT-licensed software. Each single- or multi-organization installation has its own operator and platform administrators. Core workflows require no upstream account, central database, subscription, telemetry, or proprietary provider. See [ADR 0012](../architecture/adr/0012-self-hosted-distribution.md).

## Actors

- **Platform owner:** provisions organizations and operates the platform under audited platform permissions.
- **Organization administrator:** manages tenant membership, structure, settings, branding, integrations, and rewards.
- **Directorate and project managers:** manage assigned teams, projects, reports, and activities within delegated scopes.
- **Member:** participates in activities, submits reports, learns, tracks progression, and redeems rewards.

These are starting responsibilities. See [tenancy and authorization](../architecture/tenancy.md) for the policy direction.

## Functional requirements

| ID | Module | Planned behavior and acceptance examples |
| --- | --- | --- |
| FR-01 | Organization | Invite and activate members, edit profiles, record roles, leadership and membership history, and manage configurable directorates, departments, teams, projects, and subprojects. A member can join multiple authorized teams or projects. A transfer records previous and new allocations. Authorized reports retain historical attribution after deactivation. |
| FR-02 | GitHub | Connect selected organizations, repositories, and Projects. Track issues, pull requests, reviews, and relevant project item status with validated identity mapping, contribution history and health. Members continue working in GitHub. A tenant can disable the connection and keep manual reporting. |
| FR-03 | Reports | Draft and submit individual, project, directorate, and periodic reports using configurable templates. Include manual work and attributable provider evidence. Let members inspect imported material before submission. Authorized reviewers approve or reject with feedback. Preserve review and revision history and apply access rules to exports. |
| FR-04 | Recognition | Configure scoring, progression, achievements, badges, missions, adjustments, and leaderboard visibility. Members can explain individual awards and deductions from activity history. Technical and non-technical activities qualify under applicable rules. |
| FR-05 | Challenges | Configure eligibility, registration and activity windows, individual and team enrollment, evidence, questionnaires or approved external forms, reviewers, and rewards. Store submission and review history. A retry of the same successful review must not create a duplicate award under the default policy. |
| FR-06 | Rewards | Configure currency identity, catalog, prices, stock, availability, per-member limits, and approvals. Members see balances, ledger history, and redemption status. Administrators handle fulfillment and eligible reversals. Concurrent requests cannot overspend or oversell. |
| FR-07 | Learning | Create technical and non-technical courses, categories, modules and learning paths with prerequisites, videos and playlists, assessments, enrollment, progress, and validated completions. An unavailable embed must not produce completion credit. A validated completion can trigger recognition. |
| FR-08 | Documents | Evaluate optional SharePoint references, discovery, categories, and connection health. Users see only resources they are authorized to access. Prefer links and retrieval under the appropriate identity. |
| FR-09 | Analytics | Report participation, learning progress and completion, submissions, redemption, recognition, and project or directorate trends. Apply scoped access and visibility controls. Publish metric periods, denominators, exclusions, and missing-data behavior before release. |
| FR-10 | Branding | Support tenant name, logo, favicon, primary, secondary and accent colors, light and dark themes, welcome text, currency name and symbol, and reward or achievement branding. Verify theme changes and invalid assets using two tenants. See [tenant branding](../design/tenant-branding.md). |

Reporting and analytics must preserve the origin of each data point. For example, a proposed report submission rate divides eligible members who submitted within a defined period by members with a submission obligation in that period. Show an unavailable value when the denominator is zero. GitHub counts and activity signals must never act as proxy productivity ratings. Review small cohorts and opt-out settings before tenant analytics are released.

## Optional integrations

Core organizational management, authentication, reporting, gamification, learning and rewards work without providers. Authorized tenant administrators manage optional adapters through [Organization Settings → Integrations](integration-hub.md). See the [provider catalog](../integrations/provider-registry.md) for the required optional capabilities and expansion candidates.

## Non-functional requirements

| Area | Review and acceptance direction |
| --- | --- |
| Isolation and security | Check authenticated actor, active membership, tenant, permission, and resource scope on the server. Run negative tests for every tenant-owned surface. Audit relevant privileged actions. |
| Privacy | Collect the smallest dataset for an explicit purpose. Define retention, requests for access or correction, deletion, and deployment responsibilities before collecting real member data. |
| Accessibility | Target WCAG 2.2 AA for supported flows. Verify keyboard, screen reader, contrast, zoom and theme behavior. |
| Localization | Prepare for English and Brazilian Portuguese. Use locale-specific formatting, plural rules, and explicit organizational time zones for calendar deadlines. Keep structures, currencies and workflows configurable across regions. |
| Reliability | Use atomic writes for financial-style ledger operations and defined retry and reconciliation behavior for external data. Agree on availability, recovery, and load targets before deployment planning is accepted. |
| Maintainability and portability | Document contracts, decisions, migrations, and provider dependencies. Require reproducible setup and a practical self-hosting path independent of project-operated infrastructure. Document provider requirements, limits, costs and alternatives. Validate dependency licenses before adoption. |

See [gamification rules](gamification.md), the [module map](../architecture/overview.md), and the [decision register](decisions.md).
