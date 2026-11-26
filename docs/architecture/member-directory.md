# Tenant member directory

An active administrator of the requested tenant can list and inspect memberships. The bearer token stays server-side in the web integration. The API returns `Cache-Control: no-store` on successful reads.

| Request                                     | Response                                           |
| ------------------------------------------- | -------------------------------------------------- |
| `GET /api/tenants/{id}/members`             | Up to 50 records and `nextCursor`, a UUID or null. |
| `GET /api/tenants/{id}/members/{accountId}` | One membership record with the same fields.        |

Example filtered request: `GET /api/tenants/{id}/members?emailPrefix=atlas-&role=member&active=true`.

Filters are optional and combined with AND. The email prefix is literal and case-insensitive, with one to 254 printable ASCII characters excluding spaces. `role` takes `administrator` or `member`. `active` takes `true` or `false`. An unfiltered list includes active and inactive memberships. To continue a filtered list, send the same filters and the returned cursor as `after`. A null cursor ends pagination. Restart pagination when a filter changes.

```json
{
  "items": [
    {
      "accountId": "20000000-0000-4000-8100-000000000003",
      "email": "atlas-example@example.invalid",
      "role": "member",
      "active": true,
      "joinedAt": "2026-11-24T12:00:00Z"
    }
  ],
  "nextCursor": null
}
```

A malformed UUID or filter returns 400. A missing or invalid session returns 401. Unauthorized tenant scope and unavailable detail records use the same 404. Records contain account ID, email, membership role, active state and join time.

## Database and security

Migration `0006_member_lookup.sql` introduces schema version 7 and installs a read-only directory lookup. It preserves the original unfiltered database function for existing callers. The API sets the verified account ID and requested tenant ID on its PostgreSQL transaction. The non-login directory role can read the five membership columns and two account columns required for this response. Forced row-level security filters membership globally by the current tenant before the lookup intersects details or filters with that set. The function independently requires an active administrator membership in that same tenant. It returns no result without the required context.

The [tenant isolation diagram](diagrams/juno-multi-tenant-isolation.md) describes the existing transaction boundary. See [ADR 0001](adr/0001-tenant-data-isolation.md) and [JUNO-0028](../development/tasks/JUNO-0028.md). The scoped SQL fixture and browser-run HTTP regression cover pagination, filtering, single-record access, inactive records and cross-tenant denial. Use the disposable [Compose test runbook](../development/docker.md) for local verification.
