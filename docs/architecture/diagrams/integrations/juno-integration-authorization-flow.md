# Integration authorization flow

**Status:** Proposed. **Last meaningful update:** 2026-11-24.

A tenant administrator starts a scoped authorization, consents at a provider, and returns to the server callback. The server protects credentials and displays redacted status.

State, current actor and tenant, replay rules, and PKCE where applicable protect the exchange. Provider-specific scopes await review.

[Editable master](juno-integration-authorization-flow.drawio) · [SVG](juno-integration-authorization-flow.svg) · [PDF](juno-integration-authorization-flow.pdf)

Prepared with Codex assistance for the Integration Hub proposal. See [JUNO-0005](../../../development/tasks/JUNO-0005.md), [decision record](../../adr/0007-integration-adapters.md), and [technical context](../../../integrations/authentication.md). Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence.
