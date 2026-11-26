# JUNO-0027 production V2 review

The maintainer approved the [interactive Design System V2 baseline](https://github.com/oEnzoRibas/Juno/tree/7e434d664e8ad02963684406efd6932fd11b2663/docs/design/style) on 2026-11-25. This is the application review for [PR #37](https://github.com/oEnzoRibas/Juno/pull/37) and [issue #88](https://github.com/oEnzoRibas/Juno/issues/88). Final acceptance of the running application is pending.

## Runtime pin

| Input or observation | Value                                                                                                                                                       |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Runtime checkout     | `e1d91b710272388dcb610bec3b3067a24b0a0ac7`                                                                                                                  |
| Git tree             | `68a2e4e52bc26402682930f2d131df5605b51cf9`                                                                                                                  |
| Integrated main      | `1bed595` including corrected schema 8 validation and the review launcher                                                                                   |
| Web                  | [Português (Brasil)](http://127.0.0.1:3306/sign-in?lang=pt-BR) · [English](http://127.0.0.1:3306/sign-in)                                                   |
| API                  | [Readiness](http://127.0.0.1:4306/api/ready) · [OpenAPI](http://127.0.0.1:4306/api/openapi.json)                                                            |
| Runtime checks       | See [review status](../evidence/v2-runtime/review-status.json) for project, both image identities, schema and internal readiness.                           |
| Build provenance     | The launcher built the clean, detached checkout. The runtime image IDs are recorded. The runtime lacks baked revision and source-tree metadata at this pin. |

Use a separate browser profile if another local Juno preview is open. A cookie can be shared across ports on the same host. The preview uses its own Compose project, private database network and synthetic database volume.

## Open or reproduce

From the checkout that includes [the review CLI](../../../../../scripts/review/README.md), open a private terminal to retrieve the locally generated platform, Alpha administrator, Alpha member and Beta administrator accounts.

```powershell
node scripts/review/cli.mjs status --pr 37
node scripts/review/cli.mjs credentials --pr 37
```

The extra synthetic account `dual@review-v2.example.invalid` is a Beta administrator and a regular member of V2 Secondary Workspace. On the original Windows machine, retrieve that account with this command from the Codex session directory.

```powershell
$dual = Import-Clixml -LiteralPath '.\work\juno-uat-v2-private\official-dual.clixml'
$dual.GetNetworkCredential().Password
```

With no existing review for #37 and while the live PR head equals the runtime pin, the launcher builds and seeds the exact revision.

```powershell
pnpm review:start --pr 37 --sha e1d91b710272388dcb610bec3b3067a24b0a0ac7 --web-port 3306 --api-port 4306
```

The launcher requires the pin to be the live PR head. If the head has advanced, keep the running exact-revision preview or create a new detached review checkout at `e1d91b710272388dcb610bec3b3067a24b0a0ac7` for historical reproduction. Use the pinned repository's [Compose setup](../../../docker.md) with a new private environment file, unique project, separate volume and free loopback ports. Bootstrap a synthetic administrator with the existing [operator command](../../../docker.md) and seed new fictional data. The launcher uses local Docker and GitHub CLI access. Review-ready evidence can be published in a later documentation commit while this environment stays pinned.

Use `node scripts/review/cli.mjs stop --pr 37` only to end and remove the isolated review project, including its synthetic database and checkout. Export any needed review evidence first. Leave the other UAT projects intact.

## Review checklist

1. Compare the sign-in and activation layouts in both languages. Verify input order and focus, password reveal, neutral invalid credentials, and invitation activation. Switch language on the invitation page and confirm the code remains available.
2. Sign in as the dual account. Open both organizations, check membership labels and switch between them. Beta offers the authorized invitation action. V2 Secondary Workspace hides it for a regular member. Compare the decorative accent.
3. Exercise 1280 px expanded and compact rail, 768 px compact tablet rail, then 320 and 390 px mobile layout. Open the drawer and press Escape; focus returns to the trigger. Open Your account through the mobile bottom navigation. Change language and theme, return to the workspace, and check that the organization context and preferences survive.
4. Open platform administration as the platform operator, create a fictional organization, and create and activate a private invitation. Use a separate browser context for the invite. Verify a regular member cannot access platform administration or a foreign workspace. Sign out from Your account and verify a protected route returns to sign-in.
5. Test actual zoom, keyboard and reduced motion, including 200% zoom and the seven reference widths. Check focus, control bounds, labels and contrast. Record assistive-technology findings separately from automated results.

## Runtime evidence

| Approved prototype or historical input                                                  | Exact-runtime capture and scope                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Prior shell desktop UAT](../evidence/shell-review/juno-shell-redesign-workspace.png)   | [V2 dashboard](../evidence/v2-runtime/desktop-dashboard.png), with a verified organization and invitation capability.                                                                                            |
| [Approved platform composition](../../../../design/style/evidence/desktop-platform.png) | [Runtime provisioning](../evidence/v2-runtime/desktop-platform.png), with the real accent input, slug and server action.                                                                                         |
| [Approved dark mobile account](../../../../design/style/evidence/mobile-account.png)    | [Runtime account](../evidence/v2-runtime/mobile-account.png), with localized preferences and actual session exit.                                                                                                |
| [Approved access board](../../../../design/mockups/juno-v2-access.md)                   | [Desktop sign-in](../evidence/v2-runtime/desktop-sign-in.png), [mobile activation](../evidence/v2-runtime/mobile-activation.png) and [organization selection](../evidence/v2-runtime/desktop-organizations.png). |
| [Approved navigation board](../../../../design/mockups/juno-v2-navigation.md)           | [Compact tablet](../evidence/v2-runtime/tablet-compact.png), [mobile workspace drawer](../evidence/v2-runtime/mobile-workspace-drawer.png).                                                                      |

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

The schema 8 runner verifies the build, HTTP and OpenAPI, idempotent migrations, five SQL regressions, the browser suite and the concurrent profile audit assertion. [Browser observations](../evidence/v2-runtime/browser-observations.json) record the exact pinned preview's sampled contrast and drawer containment.

Agent 02 passed lint, type checking and 15 Vitest cases on the V2 runtime pin. The exact pin's [GitHub workspace job](https://github.com/oEnzoRibas/Juno/actions/runs/45731564818/job/139614576866) and [Compose job](https://github.com/oEnzoRibas/Juno/actions/runs/45731564818/job/139614576541) passed. Local full Compose QA used the previous application-identical checkout bb3d1c99333eb8d5ee913da2843295ffcc039028. All five SQL fixtures and ten browser tests passed, followed by the persisted concurrent-profile audit check. The additive merge brought only review tooling, root script entries and coordination documentation. See the [local structured browser report](../evidence/v2-runtime/local-compose-scenarios.json).

Agent 03 is validating the pinned application independently. Final human runtime acceptance remains pending.

The [shared frontend contract](../../../../design/design-system-v2-implementation.md#extend-and-synchronize) covers the dependent #43, #48 and #51 adoption order. These branches require Agent 01's stable pin release and their own validation. The evidence records human visual approval, runtime implementation, technical QA and final acceptance as separate milestones.

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
