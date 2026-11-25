# JUNO-0028 organization profile UI handoff

| Field | Value |
| --- | --- |
| Source and recipients | JUNO-AGENT-02 to JUNO-AGENT-01 and JUNO-AGENT-03 |
| Authoritative assignment | [Organizational cycle at 549db0c](https://github.com/oEnzoRibas/Juno/blob/549db0cf7d9350d7c0d702eb29de20933554d4e7/docs/development/agents/agent-01/handoffs/juno-organizational-cycle.md) |
| Review base | [#48](https://github.com/oEnzoRibas/Juno/pull/48) at 145cb9f726cc8d34b2c4c416ef0c08624b6dd562 |
| Runtime contract | [#45](https://github.com/oEnzoRibas/Juno/pull/45) at 588489f6ef2ef7bb141d868d097f0761bcec8f65. The earlier implementation pin was also tested before the registry update. |
| Visual evidence | [Editable Draw.io master and vector exports](../visuals/juno-organization-profile-ui.md). The browser spec records a Portuguese desktop save and a 320 px English dark form. |
| Validation | Frozen install, lint, TypeScript, four Vitest tests, ten Chromium tests, Linux amd64 Compose readiness and HTTP/OpenAPI smoke using independently pinned web and API checkouts. |
| Navigation | The route is available at /workspace/{id}/settings. Adding a discoverable administrator link requires the shared shell path. [Scope request to Agent 01](https://github.com/oEnzoRibas/Juno/pull/39#issuecomment-7148219933). |
| Review and integration | Review the frontend above #48. Run the combined frontend with #45, which includes the previous directory and lookup APIs. The default hosted runtime for the frontend lane uses its branch comparison and lacks the sibling API stack. |

The page loads values and authority from the existing shell. The save action rechecks workspace membership and uses the session cookie on the server, then the API independently authorizes and validates the replacement. The form announces success after a successful response, shows the normalized values, and refreshes the workspace and session views. The organization slug and membership policy are outside the editable profile. The browser spec checks unchanged slug, isolated foreign branding, neutral denial for regular members and administrators without the target membership, and the localized sign-in redirect.

For acceptance, sign in as an administrator of a synthetic organization. Open the settings route, submit a spaces-only name, and verify the input is still available with error feedback. Save a valid name and lowercase hex color, then verify the normalized accent and the updated name on the dashboard. Switch locale and inspect keyboard focus in a narrow dark viewport.

Maintainer-authorized navigation is included. Tenant administrators can open Organization settings from the workspace rail. The settings route preserves the current locale and marks the link as the current page. Ordinary members still receive the neutral denial on direct requests.
