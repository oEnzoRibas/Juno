---
name: juno-database
description: Review or evolve Juno PostgreSQL migrations, persistence invariants and audit transactions. Use for authored migrations or database validation. UI work and live production administration have separate scopes.
license: MIT
metadata:
  version: '1.0.0'
---

# Juno database

## Inputs and outputs

Use the base schema, applied migration journal, current SQL fixtures and intended invariants. Deliver additive migration source, generator metadata, exact-schema evidence and operational handoff as applicable.

1. Start with [tenancy](../../../docs/architecture/tenancy.md), the existing Drizzle migration directory and [testing gates](../../../docs/testing/README.md). Verify the exact migration base before writing. Preserve previously applied SQL and its generated metadata.
2. Generate or review the new change against both a clean database and an upgraded database when relevant. Use row-level policies, grants and transaction boundaries appropriate to the actual runtime role. Check audit integrity, failure and retries with synthetic data.
3. Run the applicable SQL regressions in an isolated Compose project. Record the real schema, migration run and rerun, fixture names and observed outcomes. Compare the journal or checksum evidence if the task affects migration integrity.
4. If the journal, privileges or expected schema differs, stop changes in that database, preserve the observed state, and retry in a fresh disposable project. Record the discrepancy before claiming success.

The review uses local Docker/PostgreSQL and synthetic data. Existing UAT and live installation data require their own authorization.
