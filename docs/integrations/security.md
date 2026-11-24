# Integration security and privacy

**Status:** Proposed implementation controls. See the [threat model](../security/threat-model.md).

- Treat connection instances, jobs, destinations, sync history, checkpoints and credential references as tenant-owned. Authorize listing, installation, modification, retries, diagnostics and disconnect separately. Enforce tenant-aware keys and database policy. Workers re-check connection scope, revision and grants immediately before API calls and writes.
- Validate provider webhook signatures against the exact raw request. Resolve installation-to-tenant mapping only after authentication. Check allowed event types and payload sizes, deduplicate delivery IDs and enforce freshness where supported. Rate-limit inbound traffic and isolate provider limits.
- Protect credentials with scoped service identities, secret storage, rotation and audited access. Restrict egress and validate provider endpoints. Keep private response content, tokens and raw payloads out of frontend state, logs and error histories.
- Separate external references, synchronized metadata, cached content and local uploads. Permit display only where the viewer may access the underlying resource. Avoid using a privileged connection as evidence of member access. Prefer references over copied content. Account for reduced permissions during the cache lifecycle.
- Track consent, requested and actual permission scopes, administrator actions and security outcomes with tenant-scoped audit records. Document retention, disconnect and deletion by provider. Keep authorized historical reports and rewards and remove sensitive cached material according to policy.

Validate denied cross-tenant access and inference, credential expiry, scope reduction, forged or replayed callbacks, job revision races, redaction and revoked document permissions using synthetic data.
