# Provider authentication

**Status:** Proposed controls. Core Juno sign-in uses its own [identity architecture](../architecture/decision-candidates.md) and remains independent of provider connections.

A server-verified tenant administrator initiates an authorized connection. Create a short-lived, single-use authorization transaction bound to the exact tenant, actor, provider, connection intent and approved redirect. Validate the returned state, issuer where applicable, and callback identity and current membership before server-side code exchange. Use PKCE where applicable and supported. Treat cancellation, state mismatch, replay and changed administrator status as failures. [OAuth 2.0 security BCP](https://www.rfc-editor.org/rfc/rfc9700.html)

Prefer scoped installation or OAuth credentials. Validate provider account and resource grants. Exchange and refresh tokens on the server. Encrypt access and refresh tokens at rest and restrict key access and tenant credential records. Ensure refresh rotation and concurrent callbacks cannot replace newer credentials. Never return tokens to the frontend or log tokens, authorization codes and sensitive provider responses.

Distinguish locally disabling a connection from revoking access. Expired or revoked grants suppress new jobs until reauthorization. On disconnect, revoke remotely when supported, remove local credentials and document any required action at the provider. See [lifecycle](integration-architecture.md) and [security](security.md).
