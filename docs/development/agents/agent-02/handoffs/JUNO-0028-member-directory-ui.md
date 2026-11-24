# JUNO-0028 member directory UI handoff

| Field | Value |
| --- | --- |
| Source and recipients | JUNO-AGENT-02 to JUNO-AGENT-01 and JUNO-AGENT-03 |
| Assignment | [Post-UAT release](https://github.com/oEnzoRibas/Juno/pull/39), coordination head `66d30119a5f9d4aaaa4899e665bcbb507a4baa0d` and [Agent 02 acknowledgement](https://github.com/oEnzoRibas/Juno/pull/39#issuecomment-7141351297) |
| Branch and base | `feat/juno-0028-member-directory-ui` from the verified [shell PR #37](https://github.com/oEnzoRibas/Juno/pull/37) at `a7825a6b814013527414e7478fa77d5b2d3eb60c`. The unpublished work began on `08f05293f644c51d537530a6bbbb642f1ae13117` and was replayed on the current shell tip. |
| Implementation | `130dccfca0392bca01ed68983b912013589b5a01` and `fa412b78c7871e3b072ed7162d136a695f147fd1`, [PR #43](https://github.com/oEnzoRibas/Juno/pull/43). |
| Runtime contract | [API PR #40](https://github.com/oEnzoRibas/Juno/pull/40) at `7d7f7a447e56159bbdc7eb6587e7fcaaa564c23d`. `GET /api/tenants/{id}/members` supplies membership role, active status, join date and an optional next cursor. |
| Scope | Read-only member table, administrator navigation, server-side session handling, localized status and dates, cursor links, focusable narrow layout, and localized loading, error and neutral unavailable states. No backend code or dependency manifests changed. |
| Validation | Frozen install, lint, TypeScript, four Vitest, Linux amd64 Compose build and readiness, HTTP/OpenAPI smoke, and nine Chromium Playwright scenarios passed. The 51-membership browser test confirmed 50 and 1 rows on the two cursor pages and return to the first page. The frontend checkout ran with the separate API checkout. Playwright covered session and tenant scope, member-versus-admin visibility, navigation, empty and invalid cursors, English and Brazilian Portuguese, desktop and narrow layouts. |
| Visuals | [Editable mockup and exports](../visuals/juno-member-directory.md). Desktop and 320 px dark browser screenshots use synthetic data returned by the API. |
| Merge order | Review the frontend against #37. Integrate #37 and #40 before deploying the directory UI or running its CI against the complete stack. The frontend PR contains no copy of the #40 code. |
| Next action | Agent 01 can reconcile the two prerequisites and record the next authorized frontend assignment. Agent 03 can rerun the browser spec once the combined revisions are available. |

## Runtime and acceptance

The shell shows the directory link only when the server-derived workspace role is administrator. The server sends the existing bearer session with the directory request. The API enforces tenant and role authority independently and supplies the same unavailable result for denied reads. The UI preserves the neutral HTTP 404. Join dates use localized UTC output and the table uses text as well as status coloring.

Validate with a fresh synthetic tenant. Invite an administrator and a member, then sign in as the administrator and open **Members**. Switch language, inspect the table at 320 CSS pixels, and use the keyboard to focus and scroll the table. In an organization with more than 50 memberships, use the server-issued next cursor to navigate and return to the first page. A member or an administrator of a different organization must receive the neutral denial state.

Directory search, global filters, lifecycle changes and role changes require a subsequent API assignment. The existing invitation link remains in the shell.
