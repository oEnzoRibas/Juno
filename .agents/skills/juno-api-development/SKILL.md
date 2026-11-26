---
name: juno-api-development
description: Change Juno REST contracts and service behavior using the existing NestJS and OpenAPI layers. Use for endpoint evolution or API integration. Delegate tenancy review when access boundaries change.
license: MIT
metadata:
  version: '1.0.0'
---

# Juno api development

## Inputs and outputs

Use the task, published API base, relevant ADRs, intended status codes and existing caller behavior. Deliver contract, implementation, applicable regression evidence and a handoff with precise DTO, status and authorization details.

1. Read the [application topology](../../../docs/architecture/overview.md), module documentation and [testing gates](../../../docs/testing/README.md). Trace the normal controller, service and persistence path. Keep breaking changes explicit and preserve supported historical data.
2. Keep input validation, transactions, public errors and OpenAPI aligned. Reuse the existing module boundaries. When an operation also writes an audit event, validate failure and retry behavior in the same transaction.
3. Verify the actual endpoint in isolated Compose where applicable. Assert the documented response and legitimate denial outcomes using synthetic data. Check the contract exposed through OpenAPI separately from service unit tests.
4. Publish the exact contract revision and any consumer dependency. If missing decisions, migrations or caller behavior prevent a safe change, record the blocker and preserve the existing behavior.

Shell and local builds are sufficient for source verification. Isolated Docker/PostgreSQL is needed for runtime or schema claims. This skill does not grant production access.
