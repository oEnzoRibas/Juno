# Organization Management UAT

The independent Organization Management candidate is available for maintainer review. It uses a fictional dataset and its own PostgreSQL volume. Acceptance and merge authorization are pending.

| Resource | Value |
| --- | --- |
| Web (Portuguese) | http://127.0.0.1:3302/sign-in?lang=pt-BR |
| Web (English) | http://127.0.0.1:3302/sign-in |
| API readiness | http://127.0.0.1:4302/api/ready |
| OpenAPI | http://127.0.0.1:4302/api/openapi.json |
| Compose project and volume | `juno-uat-org` and `juno-uat-org_database` |
| Candidate and tree | `72ba6be66715178a750b042fa97c1320d2b7fb1e` and `ea9b77db5c9290e320cc1114b6244bc3e49d3e29` |

Use a separate browser profile or private window for each preview. Browsers share same-host cookies across ports. The original `juno-uat` and `juno-uat-shell` projects remain available with their separate volumes.

## Local credentials

```powershell
# From the Codex session directory.
$private = (Resolve-Path .\work\juno-uat-org-private).Path
& (Join-Path $private 'Get-JunoUatCredentials.ps1')
& (Join-Path $private 'Get-JunoUatCredentials.ps1') -Invitations
```

The Windows DPAPI helper displays only this preview's credentials and invitation links. Two preset links are available until their stated expiration. An authorized user can issue fresh invitations.

| Account | Role |
| --- | --- |
| `atlas-admin@uat.example.invalid` | Atlas administrator |
| `atlas-member@uat.example.invalid` | Atlas member |
| `mare-admin@uat.example.invalid` | Maré Alta administrator |
| `mare-member@uat.example.invalid` | Maré Alta member |
| `dual@uat.example.invalid` | Atlas member and Maré Alta administrator |
| `platform@uat.example.invalid` | Platform administrator without an organization membership |

## Test scenarios

1. Sign in as Atlas administrator. Open Atlas, then **Membros**. Filter by role, active state or a literal email prefix. Open a member record and return to the filtered list. The seeded organization fits on one page. The disposable browser regression exercises more than one page.
2. Open **Configurações da organização** in the workspace rail. Update the name and decorative accent. Confirm the save and the dashboard values. Reopen the settings as another role and verify only an active administrator of that organization can reach them.
3. Sign in as the dual-role account. Switch organizations and compare management links. Atlas gives ordinary member access. Maré Alta gives administrator access. Toggle language on the settings page and verify the workspace and current navigation entry are preserved.
4. In a separate browser context, open a Maré Alta member or settings URL with an Atlas-only account. Expect the localized unavailable page. Test the light and dark themes and a narrow viewport.
5. Confirm a platform-only administrator can provision a fictional organization and manually issue an invitation. Activate it as a separate synthetic account.

Available features include the Application Shell, onboarding and invitations, member reads, filters, detail, audited name/accent editing and isolated QA. Membership state and role editing, directorates, teams, projects, organization audit UI, asset uploads and email delivery remain outside this candidate.

## Startup and shutdown

```powershell
# From the Codex session directory.
$uatEnv = (Resolve-Path .\work\juno-uat-org-private\compose.env).Path
Set-Location -LiteralPath .\work\juno-uat-org
if ((git rev-parse HEAD) -ne '72ba6be66715178a750b042fa97c1320d2b7fb1e') { throw 'Unexpected candidate' }
docker compose --env-file $uatEnv -p juno-uat-org config --quiet
docker compose --env-file $uatEnv -p juno-uat-org up --no-build -d --wait
docker compose --env-file $uatEnv -p juno-uat-org ps -a

# Ordinary shutdown preserves the candidate data.
docker compose --env-file $uatEnv -p juno-uat-org down
```

Use `docker compose --env-file $uatEnv -p juno-uat-org build migrate` at the pinned checkout if the image must be rebuilt. PostgreSQL 17 uses Juno schema version 8 and an internal-only network. Keep all three preview volumes. Reset or replacement requires explicit maintainer authorization.

## Provenance

| Input | Exact revision |
| --- | --- |
| Main, including merged #38, #39 and #44 | `c93ca1c7a372396cce1880b01d55171db3262a84` |
| #46 | `ef8a1dfc2c44779721de3daf187ac40e561dbc47` |
| #36 | `7c17cc435d863e5b43c4a8302b2ad8ec730828eb` |
| #37 | `a7825a6b814013527414e7478fa77d5b2d3eb60c` |
| #40 | `7d7f7a447e56159bbdc7eb6587e7fcaaa564c23d` |
| #41 | `46b1a9408077d1a2564bdc403d158a8ebb294ec6` |
| #45 | `588489f6ef2ef7bb141d868d097f0761bcec8f65` |
| #49 | `0a2bd92fa68c79e01cfbaff22bc8df3635be8d0a` |
| #43 | `e5de071650154641b9f08e7c0ba212d5e71def0a` |
| #48 | `145cb9f726cc8d34b2c4c416ef0c08624b6dd562` |
| #51 | `61534be066a32f94a5659e19007d1bad8998803a` |

Reproduce the tree from main using #46, #36, #51 and #49 in that order. The last two heads carry their respective frontend and backend ancestry. Resolve the single runner overlap with the #49 version, which contains all five distinct SQL fixtures and the isolated test credentials. Compare the reconstructed tree to the recorded tree. #52 formatting is outside this snapshot.

## Validation evidence

The final composition passed frozen install, lint, type checks, four Vitest, twelve Playwright scenarios, all five PostgreSQL fixtures, readiness/OpenAPI smoke, fresh migrations and migration rerun on disposable Compose. The separate running UAT passed seeded login, role switching, localization, themes, settings navigation, member lookup and tenant denial checks. The first full-suite run reached the existing shared-email login budget. #49 and #51 now isolate synthetic login fixtures. Production limits were unchanged.

[PR #54](https://github.com/oEnzoRibas/Juno/pull/54) and [PR #55](https://github.com/oEnzoRibas/Juno/pull/55) provide independent evidence for the earlier composition and the initial rate-limit finding. This record pins the subsequent final candidate. Human acceptance remains pending.
