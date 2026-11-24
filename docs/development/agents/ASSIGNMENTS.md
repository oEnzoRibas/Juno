# Authoritative task assignments

**Publisher:** JUNO-AGENT-01. **Registry branch:** `docs/juno-0034-agent-coordination`. Verify the published Git revision from the coordination PR before acting. This registry governs ownership while the queue governs task order. Agent statuses and handoffs report evidence and never supersede this registry.

| Task | Agent | Claim | Scope and reserved paths | Branch and exact base | Dependencies and handoff |
| --- | --- | --- | --- | --- | --- |
| [JUNO-0034](../tasks/JUNO-0034.md) | 01 | Active at publication | Coordination, central queue/protocol, agent registry, ADR and contribution docs. Paths in this PR. | `docs/juno-0034-agent-coordination` from `main` at `8d7718e8a77d21aa569f5632ab0703d2afd7b212` | Owner authorization. Publish registry revision before delegated work. |
| [JUNO-0022](../tasks/JUNO-0022.md) | 03 | Assigned | Independent, repeatable Compose onboarding validation and CI handoff. `scripts/quality/**`, `docs/testing/juno-0022-platform-validation.md` and agent-03 records. | `test/juno-0022-platform-validation` from `feat/juno-0028-tenant-onboarding` at `e6546726e23f7b0eee36be42b4a8de851c2f29c8` | [Published Compose and data baseline](https://github.com/oEnzoRibas/Juno/pull/27). Read [infrastructure transfer](agent-01/handoffs/juno-0022-platform.md). Workflow publication requires a credential with `workflow` scope. |
| [JUNO-0035](../tasks/JUNO-0035.md) | 02 | Assigned | Two owner-approved editable architecture diagrams. `docs/architecture/diagrams/development/juno-multi-agent-*`, corresponding originals under `development/references/`, diagram index and agent-02 records. | `docs/juno-0035-development-agent-diagrams` from `main` at `8d7718e8a77d21aa569f5632ab0703d2afd7b212` | Owner references and published registry. Report visual comparison and export checks. |
| [JUNO-0036](../tasks/JUNO-0036.md) | 01 | Assigned after registry publication | Onboarding OpenAPI contracts and regression. `apps/api/src/main.ts`, `apps/api/src/auth/auth.controller.ts`, `apps/api/src/onboarding/**`, `scripts/runtime-smoke.mjs`, `docs/architecture/tenant-onboarding.md` and task-specific core checkpoint. | `feat/juno-0036-onboarding-openapi` from `feat/juno-0028-tenant-onboarding` at `e6546726e23f7b0eee36be42b4a8de851c2f29c8` | Existing onboarding REST behavior supplies the baseline. Notify agents of the published contract. |

After JUNO-0034 reaches review, Agent 01 may start JUNO-0036. The other two tasks can proceed in isolated worktrees because their scopes do not overlap. The owner authorized this dependency-aware FIFO exception. The six provider tasks preserve their previous order and gates.

## Next reservations

Agent 02 owns the remaining [design baseline](../tasks/JUNO-0023.md) and [application shell](../tasks/JUNO-0027.md) when released by Agent 01. See the [frontend transfer](agent-01/handoffs/juno-0023-frontend.md). Delivery assignments must list the exact base and paths before editing. Agent 03 inherits the pending infrastructure and validation backlog through the platform handoff. Agent 01 retains database, REST contracts, authorization, migrations and core stack maintenance.
