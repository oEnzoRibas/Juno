---
name: juno-tenant-isolation
description: Defensively review Juno tenant authorization, isolation and audit boundaries. Use for changes to scoped operations or evidence of a regression. Keep validation in authorized synthetic environments.
license: MIT
metadata:
  version: '1.1.0'
---

# Juno tenant isolation

## Inputs and outputs

Use the task's authorized roles, tenant/resource contracts, baseline and expected allow and denial cases. Return a scope matrix, cited implementation evidence and passing, failed or unavailable checks.

1. Read [tenant isolation](../../../docs/architecture/tenancy.md) and the [threat model](../../../docs/security/threat-model.md). Trace identity, active membership and tenant scope from the server-side entry point through persistence and audit. Confirm UI gating complements the server rule.
2. Verify the approved role for each operation. For [directorates](../../../docs/architecture/organization-directorates.md), an active member may list and only an organization administrator may create. Verify neutral denial for an actor without the required scope, the actual query or policy, and persisted side effects. Check cache, storage or job scope where applicable.
3. Run only applicable established checks in an isolated tenant test environment. Record the actor class, expected outcome, observed HTTP or database result and whether any foreign row changed.
4. If scope or test coverage is ambiguous, keep the claim open and describe the affected boundary, mitigation and missing evidence in the authorized review channel. Preserve original logs and avoid publishing secrets, account data or sensitive diagnostic material.

Read-only source review and ordinary regression tests are within scope. Production access and external disclosure need separate authorization.
