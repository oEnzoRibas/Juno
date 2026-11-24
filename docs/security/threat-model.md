# Preliminary threat model

**Status:** Planned controls. Review with the first implemented data flow and update as attack surfaces or providers change.

## Assets and boundaries

Protect identities and sessions, invitations and recovery tokens, membership and review history, external identity mappings and credentials, challenge evidence, private reports and exports, branding assets, and ledger and audit integrity. Trust boundaries include browser to application, user to active membership, tenant to tenant, platform operator to tenant data, application to database and storage, queue to worker, and provider to webhook receiver. Actors include anonymous users, tenant members, malicious or compromised administrators, operators, and external providers.

## Threats and planned checks

| Threat | Control direction | Validation |
| --- | --- | --- |
| Cross-tenant access, or escalation within a tenant | Tenant-aware policy, least privilege, scoped grants, validated nested references, database constraints, and audited support access. | Exercise direct and indirect resource access, pooled contexts, cache, jobs, files, and exports with separate tenants. |
| Invitation theft, session hijacking, or credential abuse | Store one-time invitations and recovery tokens as digests with expiry and revocation. Use secure session storage, rate limits, rotation and revocation. If storing passwords, use a maintained password-hashing scheme. Evaluate MFA for privileged access. | Verify expiry, one-time use, deactivation, recovery, rotation, and throttling. |
| Forged, duplicate or misrouted provider messages | Authenticate webhooks, confirm connection ownership, deduplicate deliveries, cap retries, and reconcile authorized state after interruptions. Protect integration keys at rest and scope token access. | Reject invalid signatures and mismatched installations. Replay deliveries and test disconnect during sync. |
| Untrusted text, scripts, request forgery, or uploads | Validate inputs, safely render untrusted output, protect cookie-authenticated mutations from CSRF, and limit upload size, formats and content. Isolate asset serving and disallow active theme content. | Test invalid assets, unsafe markup, unauthorized uploads and cross-origin mutations. |
| Duplicate awards, overspending, overselling, or abusive adjustments | Version rules, deduplicate qualifying activity, serialize balance and stock changes as needed, and require audited compensations. | Re-run a qualifying event and race redemptions or cancellations against the same record. |
| Log and analytics disclosure, backup loss, or unchecked dependency risk | Redact personal data and credentials, restrict and retain audit logs appropriately, define cohort visibility, encrypt backups, rehearse restoration, and maintain dependency and secret management. | Inspect sample logs and export contents. Verify restore and secret rotation with synthetic data. |

Audit events should connect actor, tenant, action, target, outcome, reason when required, and timestamp. Protect integrity and access. Define who can inspect audits and when access is itself audited. Keep payloads and secrets outside log metadata by default.

## Privacy and lifecycle

Inventory purpose, fields, recipient, retention and deletion for each data flow. Map operator and tenant responsibilities, mechanisms for access, correction and deletion requests, integration subprocessors, and incident notifications before using real member information. Reconcile deletion with documented retention needs and backup expiry. Review Brazil's LGPD and deployment-specific obligations with an appropriate reviewer. This threat model proposes engineering controls. [Official LGPD text](https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm)

See [testing](../testing/README.md), deployment, and [private reporting](../../SECURITY.md).
