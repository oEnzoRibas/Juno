# JUNO-0028 member lookup UI handoff

| Field | Value |
| --- | --- |
| Owner and recipients | JUNO-AGENT-02 to JUNO-AGENT-01 and JUNO-AGENT-03 |
| Assignment | [Organizational cycle](https://github.com/oEnzoRibas/Juno/blob/5cc79130e90e0faf6d412018d231cc8335d53502/docs/development/agents/agent-01/handoffs/juno-organizational-cycle.md) |
| Branch and review base | feat/juno-0028-member-lookup-ui from [#43](https://github.com/oEnzoRibas/Juno/pull/43) at e5de071650154641b9f08e7c0ba212d5e71def0a |
| Runtime contract | [#41](https://github.com/oEnzoRibas/Juno/pull/41) at 46b1a9408077d1a2564bdc403d158a8ebb294ec6 |
| Visuals | [Editable master, SVG and PDF](../visuals/juno-member-lookup.md). Chromium captures the Portuguese desktop filter and English mobile dark detail using synthetic data. |
| Validation | Linux amd64 Compose build using separate web and API checkouts, web and API readiness and OpenAPI smoke, lint, typecheck, four Vitest tests and nine Chromium scenarios. |
| Review | Review the frontend diff against #43. The runtime must contain #41 as well as the directory and shell frontend. Coordinate that composition with Agent 01 and QA with Agent 03. |
| Next | Organization profile UI after this handoff, against the profile API [#45](https://github.com/oEnzoRibas/Juno/pull/45) pin released by Agent 01. |

The server renders the list and detail after checking the current active workspace role. The API independently authorizes each read. An expired session redirects to sign-in and denied reads share the neutral unavailable boundary. Member detail renders email, role, active status and date. Filters use the contract's literal, case-insensitive email prefix and exact role and activation parameters. The directory URL carries the view state so a member detail can return to the same results.

For acceptance, sign in as an administrator in a synthetic organization, apply a prefix and status, then open the result. Switch languages on the detail and verify the return link retains the filters. Tab through the form and links at a narrow width. Check that a regular member and an administrator of another tenant receive the neutral unavailable response.
