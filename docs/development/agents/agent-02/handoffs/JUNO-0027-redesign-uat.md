# Revised Application Shell acceptance guide

The maintainer [approved the visual proposal](https://github.com/oEnzoRibas/Juno/pull/37#issuecomment-7150244558). This is the subsequent implementation preview for interaction acceptance. Treat the Foundation, original Application Shell, and Organization Management previews as separate environments.

| Item                                 | Revision or resource                                         |
| ------------------------------------ | ------------------------------------------------------------ |
| Pull request                         | [PR #37](https://github.com/oEnzoRibas/Juno/pull/37)         |
| Shell implementation                 | 5f8ecfc1ffeffe68043163229f8f317c7cdc3028                     |
| Shell regression                     | 1ec9ba6b6f76a8643800140916eafdee577c916d                     |
| Integrated main input                | cce46311870af9854aeb4263517e2e42cf7fb007                     |
| Preview build                        | 4f6ab8f56bc94cecf9ece5651e1d42d7cd63c0c7                     |
| Loopback preview                     | http://127.0.0.1:3303/sign-in?lang=pt-BR                     |
| API readiness                        | http://127.0.0.1:4303/api/ready                              |
| Disposable review project and volume | juno-uat-shell-redesign and juno-uat-shell-redesign_database |

The preview header shows its exact short revision. Use a private browser profile for each local preview because browser cookies are scoped by host rather than port. The account catalog is fictional. Its six Windows credentials are available locally to the account that seeded the environment.

From the Codex session directory, run the following to display the synthetic accounts locally. Keep output and generated invitation URLs out of screenshots, PR notes and shell transcripts shared with reviewers.

    & .\work\juno-uat-shell-redesign-private\Get-JunoUatCredentials.ps1

## Acceptance steps

1. Sign in as atlas-admin@redesign.example.invalid. Open Atlas Júnior Engenharia. Check the organization name, membership role, current navigation and breadcrumb. Toggle the desktop rail twice. With the rail collapsed, tab to an icon and verify its label appears. Reload and check the saved desktop preference.
2. Open the account menu. Check System, Light and Dark. Switch language and verify that the workspace and route stay selected. Verify keyboard focus and signs of the current section after navigation.
3. At 320 px, use the hamburger to open the drawer. Navigate with the keyboard, press Escape, confirm focus returns to the hamburger, and reopen it with the pointer. Verify the dark theme and the absence of horizontal document overflow.
4. Sign in as dual@redesign.example.invalid. Switch between the Atlas membership and Maré Alta administration. The member view omits the invitation action. The administrator view links to the invitation section within the authenticated dashboard. Cancel in that section resets the email field and returns to the dashboard heading.
5. Use a new fictional email to generate an invitation as a tenant administrator. Select Copy invitation link and verify its status message. Open the activation URL only in a separate private context. Use the read-only field if clipboard permission is denied.
6. Sign in as platform@redesign.example.invalid. Follow the platform link. Review the slug and accent guidance. Cancel once, reopen, create a fictional organization and verify the success message and first-invitation option. Direct access to the Atlas workspace returns the neutral unavailable response for the platform-only account.
7. Sign in as atlas-member@redesign.example.invalid. Verify the absence of management links. A direct visit to a foreign workspace or platform administration returns HTTP 404. Sign out and verify that the authenticated session is revoked.

## Validation and known differences

The source branch passed lint, TypeScript, four Vitest tests and eight Chromium scenarios using the standard disposable Compose runner, including HTTP/OpenAPI, migration rerun and the branch's two SQL inspections. The preview uses current main and includes the onboarding audit runner from #36. The seeded preview was independently exercised with the platform-only, tenant administrator, regular member and dual-member identities. Clipboard verification used a synthetic invite and the evidence contains no link or token.

The implementation keeps invitations in the workspace dashboard's existing route and fragment. It keeps provisioning and the first platform invitation together under the authenticated platform route. Theme selection and rail width are browser preferences. The icon strokes are original project code. The editable design boards remain the approved concept to compare with the [actual desktop](../evidence/shell-review/juno-shell-after-desktop.png), [compact dark](../evidence/shell-review/juno-shell-after-collapsed.png), [320 px drawer](../evidence/shell-review/juno-shell-after-mobile.png), and [platform](../evidence/shell-review/juno-shell-after-platform.png) captures.

Members, member lookup and settings belong to the dependent PRs and retain their own runtime prerequisites. Interaction acceptance of this preview and explicit merge approval are pending.

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
