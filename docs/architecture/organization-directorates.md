# Organization directorates

This FR-01 / JUNO-0028 increment supports creating and listing directorates per organization. An active member of the selected organization can read its list. An active administrator of that organization can also create a directorate. Platform administration provides no standalone access. Tenant context and the authenticated actor are checked again within the server transaction.

| Operation                             | Input                                                            | Success                                                                            |
| ------------------------------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| `GET /api/tenants/{id}/directorates`  | Organization UUID. Optional `after` UUID from the previous page. | `200`, `{ "items": [{ "id": "<UUID>", "name": "Projetos" }], "nextCursor": null }` |
| `POST /api/tenants/{id}/directorates` | `{ "name": "Projetos" }`                                         | `201`, `{ "id": "<UUID>", "name": "Projetos" }`                                    |

The API uses the bearer session and `Cache-Control: no-store`. The list has at most 50 rows ordered by ID. Send the returned `nextCursor` as `after` to advance. An empty list returns `items: []` and a null cursor. Malformed IDs, cursors or input return 400. A missing or invalid session returns 401 for a well-formed request. A valid session without the necessary membership or administrator role receives the same 404 as an unavailable organization. A duplicate name within the authorized organization returns 409. A database connectivity failure returns 503. Both routes appear in the generated OpenAPI document.

## Persistence and authorization

Migration `0008_organization_directorates.sql` adds the directorate and creation-audit tables and advances readiness to version 9. Existing tenants and their memberships keep their records. New names are trimmed and constrained to 1–120 Unicode code points. The stored display name retains case, accents and internal spacing. The PostgreSQL ICU collation compares names case-insensitively and preserves accent differences for uniqueness. A named unique constraint enforces one equivalent name per organization, including concurrent submissions. Organizations may reuse the same name.

The runtime role can execute two scoped database functions. The non-login function owner has narrowly scoped privileges and forced row-level security limits membership lookup and directorate access to the supplied transaction context. A successful insert and its audit event commit together. The audit event records the organization, directorate, actor and timestamp. A conflict leaves the original display name and audit unchanged. An audit insert failure rolls back the directorate. The runtime role has no direct audit-table access.

The feature covers list and create. The initial interface exposes no lifecycle actions or delegated directorate administration. Follow the existing [tenant isolation architecture](tenancy.md) and [organization profile precedent](organization-profile.md).
