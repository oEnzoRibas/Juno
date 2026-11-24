# Architecture evaluation

**Status:** Proposed. Use a small vertical slice to evaluate tenant provisioning, invitation, and one tenant-scoped management workflow. Optimize for tenant isolation, contributor onboarding, accessibility, maintainability, and independent self-hosting. Docker and Compose are required by [ADR-0005](adr/0005-mandatory-containerization.md). See the [topology ADR](adr/0003-application-topology.md) and [technology comparison](technology-evaluation.md).

## Topology options

| Candidate | Advantages | Costs and risks |
| --- | --- | --- |
| TypeScript modular backend and separate web frontend, in one workspace | Clear API and module boundaries, independent UI, straightforward contract tests. | Two runtimes, session and origin coordination, more deployment and test work. |
| Full-stack TypeScript web application with internal modules | Smaller installation footprint and same-origin sessions. | Framework coupling and pressure to put domain logic in routes or UI. A public API needs a deliberate contract. |
| Conventional server framework and progressively enhanced pages | Simpler deployment and baseline UI, mature patterns. | Less direct use of the proposed React stack and more client work if rich interactions become central. |
| Managed backend or identity platform | Can reduce initial local operating work. | Validate license, costs, portability, tenant policy, export and restore. An independent deployment remains required. |

Compare the first two using the same synthetic workflow. Keep business modules in a single backend with relational transactions. Consider an optional worker for durable work when timing or isolation requires it. Add microservices or Kubernetes only if demonstrated operating requirements justify them.

## Candidate bounded contexts

| Context | Owns and exposes |
| --- | --- |
| Identity and access | Global identities, sessions, recovery, scoped grants, and policy evaluation. |
| Tenant management | Tenant provisioning and operational settings. Tenant content access requires a separate scope. |
| Organization and membership | Organization configuration, member lifecycle, roles and placement history. |
| Directorates and teams | Configurable hierarchy and team assignments. |
| Projects | Projects, subprojects, participation, and delegated leadership. |
| Reporting | Templates, submissions, review decisions, provenance and exports. |
| Challenges | Eligibility, enrollment, evidence, review decisions and qualifying outcomes. |
| Gamification | Rule versions, awards, experience, achievements and recognition explanations. |
| Virtual economy | Tenant currency accounts and append-only ledger. |
| Rewards | Catalog, stock, redemption approvals and fulfillment. Coordinate with the economy in a single transaction for balance and inventory changes. |
| Learning | Courses, assessments, enrollment and qualifying completions. |
| Integration Hub | Optional tenant connections, capability registry, provider mapping, webhook intake, synchronization and health. |
| Analytics | Authorized aggregation and suppression of sensitive small cohorts. |
| Notifications | Delivery preferences, channel adapters, and delivery results. |
| Branding | Validated theme configuration and tenant media references. |
| Audit | Tenant and platform audit records, access, integrity and retention. |

Use domain-driven design where invariants require it, especially economy, authorization and recognition. Complex modules can use `domain/`, `application/`, `infrastructure/`, `presentation/`, and `tests/`. Domain logic does not import UI frameworks, provider clients, or persistence implementations. Application use cases coordinate invariants and declare ports. Infrastructure implements adapters. Presentation validates and authorizes requests before invoking use cases. Use simpler folders for simple modules. A cross-module change uses an explicit service contract or a durable event when delivery must survive failure.

## Workspace options

- `apps/web` and `apps/api` are candidates for the split topology. A combined topology needs a single app. Create `apps/worker` when a distinct process is justified and `apps/docs` only after a publishing decision.
- Add `packages/contracts` if distinct consumers need stable transport contracts. Add `packages/database` only if shared tooling or persistence is justified. Keep ownership and policy decisions in domain modules.
- Candidates `packages/ui`, `packages/design-tokens`, and `packages/i18n` require an actual second consumer or independent output. Candidates `packages/config`, `packages/logger`, and `packages/testing` serve shared operational and test concerns only if duplication warrants extraction.
- Keep existing `assets/brand`, `docs`, and `.github`. Add `infrastructure` and `scripts` when they have working content. Apps depend on shared contracts and infrastructure interfaces. Shared packages do not import applications or business internals.

## Evidence required

Compare clean setup and operator time, baseline resources and cost, version support, license provenance, health and restore, authorization testability, UI accessibility and localization. Validate the same invite and scoped request with two synthetic tenants. Demonstrate repeatable migrations, recovery and concurrent writes. Capture evidence before foundational decisions are accepted.

See the [Integration Hub architecture](../integrations/integration-architecture.md), [tenant isolation](tenancy.md), [editable architecture diagrams](diagrams/README.md), [decision candidates](decision-candidates.md), and the [threat model](../security/threat-model.md).
