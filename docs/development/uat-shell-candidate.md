# Maintainer preview for the authenticated Application Shell

**State:** Ready for maintainer testing. Acceptance of this candidate and authorization to merge its pull requests are pending.

## Preview and access

| Item | Address or source |
| --- | --- |
| Web, Brazilian Portuguese | http://127.0.0.1:3301/sign-in?lang=pt-BR |
| Web, English | http://127.0.0.1:3301/sign-in |
| API readiness and OpenAPI | http://127.0.0.1:4301/api/ready and http://127.0.0.1:4301/api/openapi.json |
| Worktree and branch | `work/juno-uat-shell`, `preview/juno-uat-shell-20261124` |
| Candidate commit | `33c3cc6c52e7cffccba982efeaaa6239f507def9` |
| Main | `3053a7beab1ec657305634c77df46efe4ec472f1` |
| [PR #36](https://github.com/oEnzoRibas/Juno/pull/36), runtime regression | `7c17cc435d863e5b43c4a8302b2ad8ec730828eb` |
| [PR #37](https://github.com/oEnzoRibas/Juno/pull/37), authenticated shell | `a7825a6b814013527414e7478fa77d5b2d3eb60c` |

Use a separate browser profile or private window for this preview if the accepted preview is open. Cookies are scoped to the host and may be shared across ports in the same profile. The two Compose projects, PostgreSQL volumes, images, credentials, and web sessions are independent. The original accepted snapshot `5a8947feceab0867d9ba81c3d3a163200ff8c1cf` remains available on frontend port 3300 and backend port 4300.

From the Windows account that created the preview, run the private helper in a local PowerShell terminal:

```powershell
# From the Codex session directory.
& .\work\juno-uat-shell-private\Get-JunoUatCredentials.ps1
& .\work\juno-uat-shell-private\Get-JunoUatCredentials.ps1 -Invitations
```

| Email | Fictional role |
| --- | --- |
| `platform@uat.example.invalid` | Platform administrator with no organization memberships |
| `atlas-admin@uat.example.invalid` | Atlas Júnior Engenharia administrator |
| `atlas-member@uat.example.invalid` | Atlas Júnior Engenharia member |
| `mare-admin@uat.example.invalid` | Maré Alta Júnior Design administrator |
| `mare-member@uat.example.invalid` | Maré Alta Júnior Design member |
| `dual@uat.example.invalid` | Atlas member and Maré Alta administrator |

The helper decrypts candidate-only credentials from Windows DPAPI. Invitations expire after 24 hours and can be reissued by an authorized account. Share invitation links manually.

## Acceptance scenarios

1. Sign in as the platform administrator. Check the empty organization state and open platform administration. Provision a fictional organization if you want to repeat the onboarding scenario.
2. Sign in as the dual-role account. Open both organizations using the switcher. Check the tenant name, accent and role label. The invitation section is available in Maré Alta.
3. Use Tab to reach the skip link. Use Enter to move focus into the main region. Traverse the organization switcher. Repeat in a narrow viewport, select English and check that the selected workspace remains open. Try both operating system color schemes.
4. Open the Maré Alta workspace from the Atlas administrator's session. Expect the localized unavailable page. Sign out and confirm a protected page redirects to sign-in.
5. Generate a new member invitation from an authorized workspace. Activate it in a separate private context. Check that the new account opens the intended workspace and that the used invitation cannot be reused.

The candidate contains the Application Shell, onboarding, tenant branding and isolation, sign-in and invitations, and redacted audit and workspace capabilities through the API. It excludes the member directory from #40, the subsequent search and detail work, organization settings, membership lifecycle editing, directorates, teams, projects and an audit user interface.

## Start or stop

The local project is `juno-uat-shell`. The version 5 PostgreSQL database uses `juno-uat-shell_database` and has no host port. Web and API bind to loopback. Resolve configuration from the private file without printing it.

```powershell
# From the Codex session directory.
$uatEnv = (Resolve-Path .\work\juno-uat-shell-private\compose.env).Path
Set-Location -LiteralPath .\work\juno-uat-shell
if ((git rev-parse HEAD) -ne '33c3cc6c52e7cffccba982efeaaa6239f507def9') { throw 'Unexpected snapshot' }
docker compose --env-file $uatEnv -p juno-uat-shell config --quiet
docker compose --env-file $uatEnv -p juno-uat-shell up --no-build -d --wait
docker compose --env-file $uatEnv -p juno-uat-shell ps -a

# Ordinary shutdown preserves the candidate database.
docker compose --env-file $uatEnv -p juno-uat-shell down
```

If the candidate image is missing, build the migration service image from the exact commit with `docker compose --env-file $uatEnv -p juno-uat-shell build migrate` before starting. Recovery from the published PR commits should use a fresh worktree and the pinned main, then integrate the two pinned heads in the listed order and compare the resulting tree to the recorded candidate tree `190ae67fbe4fa1011793ac4272c98ffac5b1cd44`. Any replacement of the running candidate or destructive data reset requires the maintainer's explicit authorization.

## Validation record

- Both hosted jobs passed on [integrated main](https://github.com/oEnzoRibas/Juno/actions/runs/45461964074), [PR #36](https://github.com/oEnzoRibas/Juno/actions/runs/45464742726) and [PR #37](https://github.com/oEnzoRibas/Juno/actions/runs/45464933184).
- The shell repair replayed its three original commits with byte-equivalent incremental patches. The fourth commit corrected the synthetic fixture integration and was checked by hosted CI. No production source was changed by that fourth commit.
- Agent 03 independently ran shell and audit regressions in disposable Compose. The candidate's browser fixture check is separate from human acceptance. Hosted and local checks are scoped automated validation.

- The finalized composition passed all eight Playwright tests, three PostgreSQL regressions, readiness/OpenAPI smoke and migration idempotency in an isolated Compose project. The running candidate passed the seeded login, locale, theme, capability, membership and audit checks.
