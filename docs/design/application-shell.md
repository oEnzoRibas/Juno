# Authenticated application shell

JUNO-0027 reuses the existing organization and session routes. It gives authenticated users a responsive navigation rail, an organization overview, and a dashboard for each membership. The desktop rail sits beside the dashboard. On narrow viewports it moves above the main content. Both use the established light and dark Juno themes.

- The account overview lists authorized organizations and localized roles. An account with no active memberships receives an invitation-oriented empty state.
- The current dashboard and organization use `aria-current`. The native disclosure groups organization links and supports keyboard opening and switching. A skip link moves keyboard focus to the main region.
- The locale link switches English and Brazilian Portuguese and keeps the current organization in the URL.
- Platform administrators see a link to the existing platform administration. Tenant administrators see the current workspace's invitation section. Members keep read-only dashboard navigation.
- The active workspace's validated accent is decorative. It cannot change contrast-sensitive foreground, action, or focus roles.

## Session and authorization

The server reads the existing HttpOnly session cookie and revalidates the account and active organization memberships for each route. The browser receives display data. The bearer token stays in the request to the API. The dashboard checks the requested organization with the backend before rendering it. Invalid IDs and denied organizations receive the same localized unavailable state with HTTP 404. A missing or revoked session redirects to sign-in. Sign-out uses the existing server action.

The shell consumes the session and tenant endpoints documented in [OpenAPI PR #29](https://github.com/oEnzoRibas/Juno/pull/29). Those routes already ship in the authorized [design base](https://github.com/oEnzoRibas/Juno/pull/33). Administrative links use server-derived roles as presentation hints. The existing endpoints continue to enforce authorization. The shell does not require the additive audit or capability endpoints in [PR #34](https://github.com/oEnzoRibas/Juno/pull/34) and [PR #35](https://github.com/oEnzoRibas/Juno/pull/35).

## Validation

The [editable mockup](mockups/juno-application-shell.md) shows desktop and narrow layouts. The [agent handoff](../development/agents/agent-02/handoffs/JUNO-0027.md) records the reviewed build and browser evidence.

Run Playwright against an isolated Compose project. Bootstrap two synthetic platform accounts using the [local authentication runbook](../architecture/local-authentication.md). Pass the ordinary platform test account as `JUNO_TEST_ADMIN_EMAIL` and `JUNO_TEST_ADMIN_PASSWORD`. Pass the second account as `JUNO_TEST_SHELL_EMPTY_EMAIL` and `JUNO_TEST_SHELL_EMPTY_PASSWORD` and leave it without organization memberships.

```sh
pnpm exec playwright test tests/browser/application-shell.spec.mjs
```

The tests cover empty accounts, revoked sessions, keyboard focus, role-appropriate navigation, workspace switches, locale changes, two tenant accents, narrow reflow, and neutral access denial.
