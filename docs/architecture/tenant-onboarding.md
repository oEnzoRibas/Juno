# Tenant onboarding

This local milestone runs through Docker Compose without an identity or email provider. The platform operator bootstraps one synthetic administrator according to the [authentication runbook](local-authentication.md). That administrator signs in, opens platform administration, and creates a Junior Enterprise using a name, slug and initial brand color.

1. Issue a one-time link for the first administrator or member.
2. Copy the link to the invited person using an approved channel. Open it in a separate browser profile for a synthetic test.
3. New invitees set a password and sign in. Existing users sign in and reopen the invitation link with the matching email account.
4. Open the organization from the signed-in account page. The dashboard displays the organization name, branding accent and the active membership role.

The invitation expires after 24 hours. Reissuing a pending invitation replaces the previous token. PostgreSQL locks the invitation row while creating or attaching the membership and marks the token used in the same transaction. The database stores only a SHA-256 digest of the random opaque token. The link uses a fragment so normal navigation leaves the token out of HTTP request paths and referrers. No provider is required to create or consume an invitation.

| Endpoint | Access |
| --- | --- |
| `POST /api/tenants` | Platform administrator. Creates the tenant and initial brand color. |
| `POST /api/tenants/{id}/invitations` | Platform administrator for either role. Active tenant administrators can invite members in their tenant. |
| `POST /api/tenants/activation` | Valid unexpired invitation. Existing identities must also present their matching session. |
| `GET /api/tenants` | The current account's active memberships. |
| `GET /api/tenants/{id}` | Active membership in the request's tenant. Missing membership returns 404. |
| `GET /api/tenants/{id}/audit` | Active tenant administrator. Returns up to 50 newest onboarding events, with event type and timestamp only. Unauthorized workspace or role returns 404. |

The API serves machine-readable request, response and bearer requirements at `GET /api/openapi.json`. Activation accepts a valid bearer session for existing accounts or a password for new accounts. The runtime smoke script checks the generated contract.

The API derives the actor from a valid session. It sets the actor and requested tenant in one PostgreSQL transaction for dashboard reads. PostgreSQL RLS independently scopes tenant and membership rows. The provisioning, invitation and account-list database functions use a dedicated non-login owner, fixed search path and narrowly granted table privileges. The runtime cannot use the owner role directly. A platform administrator needs a separate membership to read a tenant dashboard. Provisioning and invitation audit rows contain actor, tenant, event and timestamp. A dedicated non-login audit reader has a fixed search path and forced row-level policies for the active administrator and tenant. The normal runtime role can only call the redacted query. It cannot read or modify the audit table directly. Platform administrators need an active tenant administrator membership to read this endpoint. The response is never cached.

The audit feed covers onboarding events only. Broader permission administration, audit retention and platform operator reporting have separate review requirements.

Playwright covers UI provisioning, branding, member activation, role checks, concurrent token use and denial for another tenant. SQL regressions cover expiry, runtime privileges and pooled connection scope. See [design tokens](../design/design-tokens.md) and [tenant isolation](tenancy.md) for the current boundaries.
