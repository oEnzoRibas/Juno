# Organization management UAT handoff

| Field | Evidence |
| --- | --- |
| Owner and recipients | JUNO-AGENT-02 to JUNO-AGENT-01, JUNO-AGENT-03 and the maintainer |
| Candidate | Preview commit 23934aca652cb00423900374f410d516bbf74a4e. Disposable validation used a separate checkout, Compose project, synthetic credentials, port pair and PostgreSQL volume. |
| Frontend inputs | [Shell #37](https://github.com/oEnzoRibas/Juno/pull/37) a7825a6, [directory #43](https://github.com/oEnzoRibas/Juno/pull/43) e5de071, [lookup #48](https://github.com/oEnzoRibas/Juno/pull/48) 145cb9f, [profile #51](https://github.com/oEnzoRibas/Juno/pull/51) 7894993. |
| Runtime inputs | [Directory #40](https://github.com/oEnzoRibas/Juno/pull/40) 7d7f7a4, [lookup #41](https://github.com/oEnzoRibas/Juno/pull/41) 46b1a94, [profile #45](https://github.com/oEnzoRibas/Juno/pull/45) 588489f. The preview also includes independent [schema QA #49](https://github.com/oEnzoRibas/Juno/pull/49) 43a3bce and the audit and backup check inputs. |
| UI scope | Administrator directory, cursor navigation, literal prefix, role and activation filters, member detail and filtered return, organization profile updates, existing settings URL, locale, themes and tenant branding. |

## Acceptance walkthrough

1. Use a synthetic organization with an administrator and at least one regular member. Sign in as its administrator. Open Members and check the account email, role, status and joined date.
2. Search with a mixed-case prefix. Set role and active status. Confirm that changing filters resets the cursor and that clearing filters returns to the first page. For a tenant with more than 50 memberships, use the API-issued Next page cursor and return to the first page. The browser regression verifies cursor reset, while the SQL fixture verifies cursor bounds and isolation.
3. Open an email from the filtered results, switch from Brazilian Portuguese to English, and return to the same filters and cursor. At a narrow viewport, tab to the table region and scroll it horizontally. Confirm that the document itself does not overflow.
4. Open the direct settings route at /workspace/{id}/settings. Submit a blank name and check localized feedback. Save a new name and a lowercase six-digit hex accent. Confirm the normalized color and updated name on the dashboard. Check the original slug and the second tenant's branding.
5. Repeat denied reads as a regular member and an administrator of a different organization. A platform administrator with no active membership in the target also receives the neutral unavailable result for settings. Check the localized sign-in redirect with no session.
6. Repeat at desktop and narrow widths and in both color schemes. Use a keyboard for the table and settings controls, and check that the visible labels and focus remain usable.

## Review and hosted CI

The unmodified shared-fixture run passed lint, TypeScript, four Vitest tests, Compose build and readiness, HTTP/OpenAPI, migration rerun and five PostgreSQL fixtures. Chromium passed ten scenarios. Two profile scenarios failed after the shared platform email hit the API's 12-attempt sign-in budget. One reported HTTP 429 directly. Keep the production budget enabled and give browser test groups distinct bootstrapped synthetic accounts in the shared runner. [Agent 01 and Agent 03 coordination](https://github.com/oEnzoRibas/Juno/pull/39#issuecomment-7149240715)

The separate frontend PR comparisons still need their backend dependencies. Hosted checks on those comparisons and an integrated local rehearsal represent different runs. Agent 01 must publish the review bases and explicitly reserve the shared shell files before Agent 02 adds the administrator settings link. The direct settings route is available on this candidate. Formatting PR #52 passed its own CI and awaits integration before it is applied across feature branches.

The member UX review confirmed independent active and inactive text, the focusable narrow table and preserved return context. A filtered-empty message could better distinguish no matches from an empty cursor page. Revisit it when a follow-up path is assigned. The current controls already exercise their layouts and denial flows. Additional reusable administration components should follow an implementation with a concrete need.

The disposable rehearsal does not replace the maintainer's acceptance decision. Use the approved preview separately for manual acceptance.

## Separate-account rehearsal

A repeat on the exact same candidate and a fresh disposable database used one bootstrapped platform account for the ten general scenarios and another for the two profile scenarios. All twelve Chromium scenarios and all five SQL fixtures passed. The harness variation was session-local. Both runs used the production API, original test files and the normal sign-in limit. The maintainer's preview and database were left intact.

## Browser captures

The six captures use synthetic data and come from the separate-account rehearsal.

- [Desktop directory](../evidence/organization-uat/member-directory-desktop.png) and [narrow dark directory](../evidence/organization-uat/member-directory-mobile.png).
- [Desktop filtered results](../evidence/organization-uat/member-lookup-filters.png) and [narrow dark member detail](../evidence/organization-uat/member-lookup-detail.png).
- [Desktop profile save](../evidence/organization-uat/organization-profile-desktop.png) and [narrow dark settings with focus](../evidence/organization-uat/organization-profile-mobile.png).
