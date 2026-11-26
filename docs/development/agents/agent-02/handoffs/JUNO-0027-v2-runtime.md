# JUNO-0027 production V2 review

The maintainer approved the [interactive Design System V2 baseline](https://github.com/oEnzoRibas/Juno/tree/7e434d664e8ad02963684406efd6932fd11b2663/docs/design/style) on 2026-11-25. This is the application review for [PR #37](https://github.com/oEnzoRibas/Juno/pull/37) and [issue #88](https://github.com/oEnzoRibas/Juno/issues/88). Final acceptance of the running application is pending.

## Runtime pin

| Input or observation | Value                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime checkout     | `bd8108b92665ad3fd3e846b9b535ccd1de19156e`                                                                                                                  |
| Git tree             | `1f4e15d69dab73097cdb5849bc0e17f62d21ee60`                                                                                                                  |
| Integrated main      | `1bed595` including corrected schema 8 validation and the review launcher                                                                                   |
| Web                  | [Português (Brasil)](http://127.0.0.1:3307/sign-in?lang=pt-BR) · [English](http://127.0.0.1:3307/sign-in)                                                   |
| API                  | [Readiness](http://127.0.0.1:4307/api/ready) · [OpenAPI](http://127.0.0.1:4307/api/openapi.json)                                                            |
| Runtime checks       | See [review status](../evidence/v2-runtime-locale/review-status.json) for project, both image identities, schema and internal readiness.                    |
| Build provenance     | The launcher built the clean, detached checkout. The runtime image IDs are recorded. The runtime lacks baked revision and source-tree metadata at this pin. |

Use a separate browser profile if another local Juno preview is open. A cookie can be shared across ports on the same host. The preview uses its own Compose project, private database network and synthetic database volume.

## Open or reproduce

Open a private PowerShell terminal in the dedicated review controller checkout. On the original machine, its path relative to the Codex session directory is `work/juno-v2-review-controller`. The [review CLI](../../../../../scripts/review/README.md) stores the project and the synthetic platform, Alpha and Beta accounts under that checkout's own namespace. The original repository continues to address the earlier UAT on ports 3306 and 4306.

```powershell
Set-Location -LiteralPath '.\work\juno-v2-review-controller'
node scripts/review/cli.mjs status --pr 37
node scripts/review/cli.mjs credentials --pr 37
```

The extra synthetic account `dual@review-v2.example.invalid` is a Beta administrator and a regular member of V2 Secondary Workspace. On the original Windows machine, retrieve that account with this command from the Codex session directory.

```powershell
$dual = Import-Clixml -LiteralPath '.\work\juno-uat-v2-private\final-dual.clixml'
$dual.GetNetworkCredential().Password
```

With no existing review for #37 and while the live PR head equals the runtime pin, the launcher builds and seeds the exact revision.

```powershell
pnpm review:start --pr 37 --sha bd8108b92665ad3fd3e846b9b535ccd1de19156e --web-port 3307 --api-port 4307
```

The launcher requires the pin to be the live PR head. If the head has advanced, keep the running exact-revision preview or create a new detached review checkout at `bd8108b92665ad3fd3e846b9b535ccd1de19156e` for historical reproduction. Use the pinned repository's [Compose setup](../../../docker.md) with a new private environment file, unique project, separate volume and free loopback ports. Bootstrap a synthetic administrator with the existing [operator command](../../../docker.md) and seed new fictional data. The launcher uses local Docker and GitHub CLI access. Review-ready evidence can be published in a later documentation commit while this environment stays pinned.

From the dedicated controller checkout, use `node scripts/review/cli.mjs stop --pr 37` only to end and remove the isolated review project, including its synthetic database and checkout. Export any needed review evidence first. Leave the other UAT projects intact.

## Review checklist

1. Compare the sign-in and activation layouts in both languages. Verify input order and focus, password reveal, neutral invalid credentials, and invitation activation. Switch language on the invitation page and confirm the code remains available.
2. Sign in as the dual account. Open both organizations, check membership labels and switch between them. Beta offers the authorized invitation action. V2 Secondary Workspace hides it for a regular member. Compare the decorative accent.
3. Exercise 1280 px expanded and compact rail, 768 px compact tablet rail, then 320 and 390 px mobile layout. Open the drawer and press Escape; focus returns to the trigger. Open Your account through the mobile bottom navigation. Change language and theme, return to the workspace, and check that the organization context and preferences survive.
4. Open platform administration as the platform operator, create a fictional organization, and create and activate a private invitation. Use a separate browser context for the invite. Verify a regular member cannot access platform administration or a foreign workspace. Sign out from Your account and verify a protected route returns to sign-in.
5. Test actual zoom, keyboard and reduced motion, including 200% zoom and the seven reference widths. Check focus, control bounds, labels and contrast. Record assistive-technology findings separately from automated results.

## Runtime evidence

| Approved prototype or historical input                                                  | Exact-runtime capture and scope                                                                                                                                                                                                       |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Prior shell desktop UAT](../evidence/shell-review/juno-shell-redesign-workspace.png)   | [V2 dashboard](../evidence/v2-runtime-locale/desktop-dashboard.png), with a verified organization and invitation capability.                                                                                                          |
| [Approved platform composition](../../../../design/style/evidence/desktop-platform.png) | [Runtime provisioning](../evidence/v2-runtime-locale/desktop-platform.png), with the real accent input, slug and server action.                                                                                                       |
| [Approved dark mobile account](../../../../design/style/evidence/mobile-account.png)    | [Runtime account](../evidence/v2-runtime-locale/mobile-account.png), with localized preferences and actual session exit.                                                                                                              |
| [Approved access board](../../../../design/mockups/juno-v2-access.md)                   | [Desktop sign-in](../evidence/v2-runtime-locale/desktop-sign-in.png), [mobile activation](../evidence/v2-runtime-locale/mobile-activation.png) and [organization selection](../evidence/v2-runtime-locale/desktop-organizations.png). |
| [Approved navigation board](../../../../design/mockups/juno-v2-navigation.md)           | [Compact tablet](../evidence/v2-runtime-locale/tablet-compact.png), [mobile workspace drawer](../evidence/v2-runtime-locale/mobile-workspace-drawer.png).                                                                             |

Production uses Nunito for display and system UI for readable data and controls. The verified tenant accent remains decorative. The account page retains the approved dedicated route. Runtime captures omit playground tools and use real provision and invitation workflows with synthetic data. Assistive-technology verification is a separate review activity.

## Validation commands

Run in a disposable checkout at the runtime pin and use separate ports from the persistent UAT.

```powershell
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm build
pnpm test
node scripts/quality/validate-compose.mjs
```

The schema 8 runner verifies the build, HTTP and OpenAPI, idempotent migrations, five SQL regressions, the browser suite and the concurrent profile audit assertion. [Browser observations](../evidence/v2-runtime-locale/browser-observations.json) record the exact pinned preview's sampled contrast and drawer containment.

Agent 03 independently verified the [previous implementation pin](https://github.com/oEnzoRibas/Juno/commit/e1d91b710272388dcb610bec3b3067a24b0a0ac7); its original [runtime and screenshot record](https://github.com/oEnzoRibas/Juno/blob/20165d959475b6d4ff45822de0055bc21b416a87/docs/development/agents/agent-02/handoffs/JUNO-0027-v2-runtime.md) remains available. The review covered 15 unit tests, five SQL regressions, ten Playwright cases and 43 dedicated browser checks, including all seven widths, native 200% zoom and keyboard containment. It identified an incorrect page-level language declaration.

The current pin declares the validated locale on the server-rendered HTML and updates it during client navigation. The Next.js proxy forwards the validated locale to the document renderer. Existing session, permissions and tenant boundaries remain enforced by the server. Local Compose passed all five SQL regressions, eleven Playwright scenarios and the persisted concurrent-profile audit assertion. See the [structured scenario results](../evidence/v2-runtime-locale/local-compose-scenarios.json). Its [GitHub CI run](https://github.com/oEnzoRibas/Juno/actions/runs/45732540431) passed both jobs. Agent 03 independently verified nine raw HTML responses, eight protected-route redirects, and two in-document language switches on this exact SHA. See the [independent locale checks](../evidence/v2-runtime-locale/independent-locale-checks.json). Final human runtime acceptance is pending.

The [shared frontend contract](../../../../design/design-system-v2-implementation.md#extend-and-synchronize) covers the dependent #43, #48 and #51 adoption order. These branches require Agent 01's stable pin release and their own validation. The evidence records human visual approval, runtime implementation, technical QA and final acceptance as separate milestones.

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
