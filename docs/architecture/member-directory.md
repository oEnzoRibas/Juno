# Tenant member directory

`GET /api/tenants/{id}/members` returns up to 50 memberships for an active administrator of that tenant. Each record contains the account ID, email, membership role, active flag and join time. The cursor is the last account ID from the current page. Pass it as `after` and stop when `nextCursor` is null. Responses use `Cache-Control: no-store`.

The API derives the account from its bearer session and sets the tenant and account IDs on the current PostgreSQL transaction. The non-login directory function owner can read membership and limited account metadata. Forced row-level security constrains the membership reads to the current tenant. A separate active administrator check guards the function output. A denied workspace or membership returns a neutral 404. The endpoint includes inactive memberships for administrators so prior joins and role information remain available.

This increment implements directory reads. Changes to membership state, role delegation, directorates and teams follow the [organization management task](../development/tasks/JUNO-0028.md). The existing [tenant isolation diagram](diagrams/juno-multi-tenant-isolation.md) describes the shared transaction boundary.
