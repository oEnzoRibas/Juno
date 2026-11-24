# Integration evaluation

**Status:** Planned. Core reporting, recognition and learning should have workflows that can operate independently of third-party availability. Before enabling a provider, document required accounts, permissions, setup, limits, expected costs, failure behavior, and a portable or manual alternative.

## Adapter contracts

Expose tenant-scoped ports for provider access and synchronization. Keep GitHub, GitHub Projects, YouTube and SharePoint calls inside adapters. Map provider data to validated activity or content references. Use fake adapters and synthetic fixtures to verify failure, retries, disconnect, limits, isolation and reconciliation. Keep credentials in secret storage with scoped access and rotation. Link durable background behavior to [ADR-0004](../architecture/adr/0004-durable-domain-events.md).

## GitHub

Evaluate a GitHub App as the default for organization-scoped synchronization. Its installation model supports targeted permissions and selected repositories. Evaluate OAuth for a specific user-delegated requirement if installation access is insufficient. Avoid personal access tokens as a normal setup path. Use the REST API where it meets repository resource and reconciliation needs. Evaluate GraphQL for Projects data and validate exact operations, installation token compatibility, required permissions, and rate limits before implementation. Juno's initial scope is authorized read and sync. Technical work and project updates stay in GitHub. [GitHub App and OAuth comparison](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/differences-between-github-apps-and-oauth-apps), [Projects API guide](https://docs.github.com/en/issues/planning-and-tracking-with-projects/automating-your-project/using-the-api-to-manage-projects)

- Confirm organization consent and bind installations, authorized repositories, and project associations to tenant scope. Use a verified mapping with stable provider user IDs. Provide a way for members to review mappings and for authorized administrators to correct disputes with an audit record.
- Validate signatures against the raw request body and route by an authorized installation mapping. Acknowledge after durable intake, process asynchronously, deduplicate delivery IDs and qualifying activity separately, and reconcile authoritative state periodically. Use bounded backoff and provider limit signals. Surface stale, failed and disconnected states and allow authorized repair or replay. [GitHub webhook practices](https://docs.github.com/en/webhooks/using-webhooks/best-practices-for-using-webhooks)
- Record the exact metric definitions, event source, coverage and freshness before exposing contribution insights. For example, reviewed pull requests can count distinct authorized pull requests with at least one submitted review attributed to a mapped member in the period. Exclude missing mappings from the numerator and show coverage. Counts describe observable activity. Qualitative recognition requires its own criteria.
- Disconnect should halt future sync, invalidate access where supported, and leave clear provenance on retained data. Define permitted historical retention and deletion before rollout.

## YouTube

Evaluate allowlisted video and playlist references and an accessible fallback link. Review embed terms, copyright, privacy, network failure, unavailable media, and caption support. Player events can support playback UI. Validate course completion using an assessment or documented attestation or review mechanism. [YouTube IFrame Player API](https://developers.google.com/youtube/iframe_api_reference)

## SharePoint through Microsoft Graph

Evaluate tenant-approved links first. For discovery, compare delegated access using the member's authorization with selected application permissions for explicitly approved sites. If using application access, determine how to enforce each member's underlying permission before displaying even titles, counts, or preview links. Avoid copying sensitive files by default. Test consent withdrawal, link changes, visibility, and credential rotation before enabling discovery. [Microsoft Graph selected permissions](https://learn.microsoft.com/en-us/graph/permissions-selected-overview)
