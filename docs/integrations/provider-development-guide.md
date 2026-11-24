# Contributor guide for integration providers

**Status:** Planned runtime and contract harness. Reviewed source contributions are the initial extension mechanism.

1. Register a scoped provider task and issue. Document the tenant workflow, supported port, native provider limitations, minimum permissions, authentication model, expected operating cost and manual fallback. Check upstream terms and dependency notices.
2. Add capability contracts only where an existing port cannot express the requirement. Register provider metadata and a versioned configuration schema. Keep secrets out of configuration returned to the browser.
3. Implement the adapter behind the relevant port. Validate resources and tenant ownership. For callbacks, bind state to the tenant and actor. For webhooks, authenticate raw deliveries before mapping installation and queuing work. Normalize provider responses and document errors and rate limits.
4. Use shared durable jobs where required. Implement bounded retries, scoped idempotency keys, disconnect behavior and useful redacted health data. Keep provider delivery separate from core transactions.
5. Test with fake adapters, deterministic payloads and at least two tenants. Cover missing credentials, expiry, disconnect during processing, unauthorized resources, stale jobs, replay, duplicates, rate limits and recovery. Use a separately approved sandbox for real API validation.
6. Update the registry, provider requirements, diagrams and operational docs. Include setup, supported scopes, security, testing and troubleshooting. Open a focused PR using the [Git workflow](../development/git-workflow.md).

Example to implement with the foundation: a fake notification adapter accepts a tenant, scoped destination, stable event ID and redacted payload and returns delivered, retryable or terminal. Test that the same event and destination are processed idempotently and another tenant cannot reuse them. Add a functional example when runtime contracts exist. Dynamic third-party plugin execution would require a separate ADR.
