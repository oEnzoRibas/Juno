# Organization profile

`PUT /api/tenants/{id}/profile` replaces the existing organization name and decorative workspace accent. It requires a bearer session for an active administrator of the target tenant. Read the current values from `GET /api/tenants/{id}`, using its existing active-membership policy.

Example replacement:

```json
{ "name": "Atlas Júnior Engenharia", "accent": "#7565F5" }
```

A successful response has `id`, `name`, and `accent` and uses `Cache-Control: no-store`. The API trims the name, requires 1–120 characters, rejects ASCII control characters in the stored name, and normalizes the six-digit hexadecimal accent to uppercase. Invalid input returns 400. No session returns 401. Unknown tenants and accounts without an active administrator membership receive the same 404. Platform administration alone does not grant profile write access.

## Migration, authorization and audit

Migration `0007_organization_profile.sql` advances readiness to schema version 8. The existing `juno.tenant` fields are `name` and `accent_hex`. The migration adds `juno.organization_profile_audit` with tenant ID, identity sequence, actor account ID and timestamp. No previous profile values or session credentials are copied into the audit event. The new table has forced row-level security, narrow append privileges and no public read endpoint.

The non-login function owner has only the field privileges needed to replace the profile and append the audit record. Transaction-local tenant and actor IDs select the active administrator row. The database enforces the same rule on the target row and the audit append. Audit and profile values commit atomically. A retry with the stored values creates no new audit event. Concurrent replacements resolve through PostgreSQL row locking. If their values differ, the last applied replacement wins.

See the [editable security flow](diagrams/juno-organization-profile.md), [current branding behavior](../design/tenant-branding.md) and [ADR 0001](adr/0001-tenant-data-isolation.md). Asset uploads, slug changes, organization membership changes and an audit-reading UI remain outside this slice.

The executable HTTP spec checks the published OpenAPI contract and role boundaries. The PostgreSQL regression forces an audit append failure to verify that the profile write rolls back. A separate schema 7 to 8 rehearsal preserved a seeded organization's name and accent and passed both targeted regressions.
