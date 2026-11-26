# JUNO-0028 member lookup UI handoff

| Field                  | Value                                                                                                                                                                           |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Owner and recipients   | JUNO-AGENT-02 to JUNO-AGENT-01 and JUNO-AGENT-03                                                                                                                                |
| Assignment             | [Organizational cycle](https://github.com/oEnzoRibas/Juno/blob/5cc79130e90e0faf6d412018d231cc8335d53502/docs/development/agents/agent-01/handoffs/juno-organizational-cycle.md) |
| Branch and review base | feat/juno-0028-member-lookup-ui from [#43](https://github.com/oEnzoRibas/Juno/pull/43) at e5de071650154641b9f08e7c0ba212d5e71def0a                                              |
| Runtime contract       | [#41](https://github.com/oEnzoRibas/Juno/pull/41) at 46b1a9408077d1a2564bdc403d158a8ebb294ec6                                                                                   |
| Visuals                | [Editable master, SVG and PDF](../visuals/juno-member-lookup.md). Chromium captures the Portuguese desktop filter and English mobile dark detail using synthetic data.          |
| Validation             | Linux amd64 Compose build using separate web and API checkouts, web and API readiness and OpenAPI smoke, lint, typecheck, four Vitest tests and nine Chromium scenarios.        |
| Review                 | Review the frontend diff against #43. The runtime must contain #41 as well as the directory and shell frontend. Coordinate that composition with Agent 01 and QA with Agent 03. |
| Next                   | Organization profile UI after this handoff, against the profile API [#45](https://github.com/oEnzoRibas/Juno/pull/45) pin released by Agent 01.                                 |

The server renders the list and detail after checking the current active workspace role. The API independently authorizes each read. An expired session redirects to sign-in and denied reads share the neutral unavailable boundary. Member detail renders email, role, active status and date. Filters use the contract's literal, case-insensitive email prefix and exact role and activation parameters. The directory URL carries the view state so a member detail can return to the same results.

For acceptance, sign in as an administrator in a synthetic organization, apply a prefix and status, then open the result. Switch languages on the detail and verify the return link retains the filters. Tab through the form and links at a narrow width. Check that a regular member and an administrator of another tenant receive the neutral unavailable response.

## V2 integration

PR #48 retains its original feature history, with V2 directory parent 1af1cb1de8e37f07e646b7f2fa0851251cd909a2. The tested implementation is cadb14a6aceb319b2efae46997badf6508190477, tree 7976a78a19a2ab155c972dc10fc668de52e327f7. The existing list and detail URLs share the V2 route group, shell navigation slot, breadcrumbs and reusable fields. Email prefixes remain literal and case-insensitive in the API. The list retains role, status and cursor. Changing language through Account returns to the same member detail with the filters, and Back to members restores that filtered view. Unauthorized requests use the existing neutral boundary.

Frozen install, lint, types, 15 Vitest cases, Linux Compose build, schema 8, migration rerun, five SQL regressions, 12 Playwright scenarios and persisted profile audit passed locally. The browser scenario checks a foreign workspace, a foreign account through the current workspace, an ordinary member, invalid and empty cursors, locale switching, and filters at narrow and desktop widths.

- [Desktop filters](../evidence/v2-member-lookup/member-lookup-filters.png)
- [Mobile detail](../evidence/v2-member-lookup/member-lookup-detail.png)
- [Structured Playwright report](../evidence/v2-member-lookup/compose-scenarios.json)
- [Stack release record](https://github.com/oEnzoRibas/Juno/issues/89)

From an exact detached checkout of the runtime pin, install locked dependencies and Chromium, then run `node scripts/quality/validate-compose.mjs` using ports distinct from all UATs. The script creates and removes its synthetic Compose environment. Agent 01 coordinates #51 on the independently qualified #48 pin.
