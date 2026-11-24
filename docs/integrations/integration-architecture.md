# Integration Hub architecture

**Status:** [Optionality accepted](../architecture/adr/0006-optional-integrations.md). [Implementation proposed](../architecture/adr/0007-integration-adapters.md).

See the [approved architecture visual](../architecture/diagrams/integrations/juno-integration-hub-architecture.md) for the proposed platform, Hub and provider relationships.

Core modules emit validated business events or call an explicit capability. The Hub resolves the tenant connection, authorized resources and adapter, then translates provider results to content references or normalized events. Keep SDKs, credentials, webhooks and persistence behind infrastructure adapters. Wire reviewed adapters through dependency injection. A missing capability returns an explicit unavailable result that allows a local workflow.

| Capability | Contract responsibility |
| --- | --- |
| Provider authorization | Installation or OAuth exchange, scopes, revocation and health. Never a dependency of core sign-in. |
| Notification delivery | Deliver sanitized messages to an authorized destination. Return provider outcomes and retry guidance. |
| Document discovery and retrieval | Separate metadata discovery, references and authorized content access. |
| Projects and contribution tracking | Read authorized project data and normalize evidence with provenance. |
| Calendar, courses and forms | Synchronize supported events, reference course content, or process authorized responses. Keep completion and reward validation in Juno. |
| Webhook intake | Validate raw payloads, map the installation and enqueue a deduplicated scoped job. |

Start within the modular backend. A candidate split under `apps/api/src/modules/integrations/` uses `domain/` for connections, events and ports, `application/` for use cases and registry resolution, `infrastructure/` for adapters, credential storage, persistence and webhooks, `presentation/` for admin and callback entry points, and `tests/` for contract and isolation checks. Add provider directories only when a provider is implemented.

## Connection lifecycle

| State | Entry and permitted transitions |
| --- | --- |
| NOT_CONNECTED | No tenant connection exists. An administrator starts CONNECTING. |
| CONNECTING | Pending authorization. Callback success goes to CONNECTED. Failure goes to ERROR. Cancellation resolves to NOT_CONNECTED for a new connection, or to the preceding persisted state for a reconnect. |
| CONNECTED | Admin may DISABLE or DISCONNECT. Failures can move to DEGRADED, ERROR or REAUTHORIZATION_REQUIRED. |
| DEGRADED | Recoverable failures or stale sync. Successful operation returns to CONNECTED. Sustained failure may become ERROR. |
| ERROR | Authorized retry or reconnect may recover. Disable or disconnect remains available. |
| REAUTHORIZATION_REQUIRED | Valid authorization is missing or revoked. Suppress jobs until reconnect, disable or disconnect. |
| DISABLED | Stop new work and reject stale jobs. Keep approved configuration and credentials for re-enable unless expired. |
| DISCONNECTED | Stop work, revoke remotely where supported, remove local credentials and keep a minimal historical record. A later connection starts a new authorization. |

On disconnect, increment a connection revision so in-flight work cannot write stale data. Define provider-specific retention for metadata and cached content. Retain provenance and history for existing reports and awards under product retention rules. Historical data visibility still requires authorization. See [authentication](authentication.md), [security](security.md) and [sync](synchronization.md).
