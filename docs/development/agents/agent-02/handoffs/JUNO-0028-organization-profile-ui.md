# JUNO-0028 organization profile UI handoff

| Field                    | Value                                                                                                                                                                                                                                              |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Source and recipients    | JUNO-AGENT-02 to JUNO-AGENT-01 and JUNO-AGENT-03                                                                                                                                                                                                   |
| Authoritative assignment | [Organizational cycle at 549db0c](https://github.com/oEnzoRibas/Juno/blob/549db0cf7d9350d7c0d702eb29de20933554d4e7/docs/development/agents/agent-01/handoffs/juno-organizational-cycle.md)                                                         |
| Review base              | [#48](https://github.com/oEnzoRibas/Juno/pull/48) at 145cb9f726cc8d34b2c4c416ef0c08624b6dd562                                                                                                                                                      |
| Runtime contract         | [#45](https://github.com/oEnzoRibas/Juno/pull/45) at 588489f6ef2ef7bb141d868d097f0761bcec8f65. The earlier implementation pin was also tested before the registry update.                                                                          |
| Visual evidence          | [Editable Draw.io master and vector exports](../visuals/juno-organization-profile-ui.md). The browser spec records a Portuguese desktop save and a 320 px English dark form.                                                                       |
| Validation               | Frozen install, lint, TypeScript, four Vitest tests, ten Chromium tests, Linux amd64 Compose readiness and HTTP/OpenAPI smoke using independently pinned web and API checkouts.                                                                    |
| Navigation               | Active tenant administrators open Organization settings from the workspace rail. The direct route remains /workspace/{id}/settings. The [coordinator handoff](https://github.com/oEnzoRibas/Juno/pull/56) pins the navigation and fixture changes. |
| Review and integration   | Review the frontend above #48. Run the combined frontend with #45, which includes the previous directory and lookup APIs. The default hosted runtime for the frontend lane uses its branch comparison and lacks the sibling API stack.             |

The page loads values and authority from the existing shell. The save action rechecks workspace membership and uses the session cookie on the server, then the API independently authorizes and validates the replacement. The form announces success after a successful response, shows the normalized values, and refreshes the workspace and session views. The organization slug and membership policy are outside the editable profile. The browser spec checks unchanged slug, isolated foreign branding, neutral denial for regular members and administrators without the target membership, and the localized sign-in redirect.

For acceptance, sign in as an administrator of a synthetic organization. Open Organization settings from the workspace rail, submit a spaces-only name, and verify the input is still available with error feedback. Save a valid name and lowercase hex color, then verify the normalized accent and the updated name on the dashboard. Switch locale, confirm the settings link remains current, and inspect keyboard focus in a narrow dark viewport.

Maintainer-authorized navigation is included. Tenant administrators can open Organization settings from the workspace rail. The settings route preserves the current locale and marks the link as the current page. Ordinary members still receive the neutral denial on direct requests.

## Integrated navigation verification

The exact coordinator preview revision 72ba6be66715178a750b042fa97c1320d2b7fb1e includes the released settings navigation and isolated login fixtures. Agent 02 independently ran frozen installation, lint, TypeScript, four Vitest tests and the standard Compose runner. All twelve Chromium tests and five PostgreSQL regressions passed in a disposable project. The browser suite verified keyboard entry, the current-page state in both locales, a 320 px dark layout, member link visibility, and direct-route denial for regular members and foreign administrators.

[Actual desktop capture](../evidence/organization-settings/organization-profile-desktop.png) · [Actual mobile capture](../evidence/organization-settings/organization-profile-mobile.png)

## V2 integration

PR #51 keeps its implementation history and integrates the released V2 member lookup parent b3a2891bb3ccaac9b7063b3f7f58b7c4cc48bc06. The locally validated runtime is 09505023f706de556d2cc2fba70896b077e3fb5e, tree 0f4f58f927a0301269f88e389f6821457f67d87f. The profile retains its public `/workspace/[id]/settings` path and is now in the V2 route group. Active tenant administrators can navigate to settings from the desktop rail and the mobile drawer. Existing lookup navigation stays available. The form uses V2 fields, feedback, button states, a decorative workspace accent, and contextual Back. Changing language through Account returns to Settings. The same profile API and server permission boundary authorize every write.

The disposable Linux Compose run built the application and passed HTTP and OpenAPI probes, idempotent migrations, schema 8, five SQL regressions, 13 Playwright scenarios, and the persisted concurrent profile audit check. The profile browser scenario verified validation, normalized name and accent, reload and navigation, mobile field containment at 320 CSS px, contextual drawer focus, and neutral denial for unauthorized and foreign accounts.

- [Desktop profile](../evidence/v2-organization-profile/organization-profile-desktop.png)
- [Mobile dark profile](../evidence/v2-organization-profile/organization-profile-mobile.png)
- [Structured Playwright results](../evidence/v2-organization-profile/compose-scenarios.json)
- [Editable mockup and exports](../visuals/juno-organization-profile-ui.md)
- [Stack #50 release record](https://github.com/oEnzoRibas/Juno/issues/89)

Use `pnpm review:test --pr 51 --sha FULL_PR_HEAD` from a checkout that contains the review CLI. For the historical runtime pin above, use a detached checkout of that revision with `pnpm install --frozen-lockfile`, `pnpm exec playwright install chromium`, and `node scripts/quality/validate-compose.mjs`. Choose free loopback ports separate from the active UATs. The existing review launcher and Compose validator manage disposable projects and fixture accounts. Independent stack qualification and final maintainer acceptance are recorded separately.
