# Maintainer UAT testing guide

A UAT preview is an independently pinned composition. Its URL does not identify the checkout or image built for a PR. Record the exact snapshot and included PR revisions, Compose project, running image IDs, observed schema and frontend-to-API readiness. Historical snapshots without baked metadata must retain that limitation. Verify new builds with the [runtime identity guide](../testing/juno-review-runtime.md). Preserve prior previews and data unless the maintainer authorizes replacement.

Use the exact commits and environment in the [preview checkpoint](history/JUNO-0037-uat-preview.md). The approved Windows preview runs on loopback only.

| Entry point              | URL                                      |
| ------------------------ | ---------------------------------------- |
| English web              | `http://127.0.0.1:3300/`                 |
| Brazilian Portuguese web | `http://127.0.0.1:3300/?lang=pt-BR`      |
| Sign in                  | `http://127.0.0.1:3300/sign-in`          |
| API readiness            | `http://127.0.0.1:4300/api/ready`        |
| OpenAPI                  | `http://127.0.0.1:4300/api/openapi.json` |

Use the local private PowerShell credential helper under the Windows account that set up the preview. The companion local operator guide holds the machine-specific path. The helper reads Windows DPAPI-encrypted accounts and invitations. Never commit the credential store or put passwords, tokens, or live invitation links in screenshots or reviews.

1. Sign in as the fixture platform administrator and open platform administration. Create a fictional organization and invite an administrator or member.
2. Open the invitation in a separate browser profile. Activate and sign in. Verify that one-time activation cannot be repeated.
3. Compare a tenant administrator with a regular member. Verify the invitation controls in the same tenant and a neutral denial in another tenant. The dual-membership account has a separate role in each organization.
4. Review the home language toggle, both color schemes, keyboard focus, narrow viewports, and distinct branding accents.
5. Inspect the OpenAPI contract if testing the audit and authorization APIs. The audit response shows event type and time to active administrators of the relevant tenant.

From the dedicated worktree, set `$uatEnv` to its private Compose environment file. Start the pinned image with `docker compose --env-file $uatEnv -p juno-uat up --no-build -d --wait` and stop with `docker compose --env-file $uatEnv -p juno-uat down`. The standard stop retains `juno-uat_database`. Use the [preview protocol](maintainer-uat.md) for an explicitly authorized update or reset. Verify the volume and a private backup before replacing data.

The candidate shell, member lifecycle, directorates, teams and projects are outside the first accepted preview. The application displays invitation links for manual sharing.

See the [Application Shell candidate](uat-shell-candidate.md) for the isolated follow-up preview and separate acceptance checkpoint.

## Review environment inventory

On 2026-11-25 the four signed-in entry pages answered HTTP 200, the four APIs reported ready, and the database schema versions and distinct Compose volumes were checked. The pinned source snapshots and all databases were preserved. Use a separate private browser context or profile for each visit because cookies are shared by host across ports.

| Environment             | Frontend and API readiness                                                                   | Project                   | Schema | Exact commit                               |
| ----------------------- | -------------------------------------------------------------------------------------------- | ------------------------- | ------ | ------------------------------------------ |
| Foundation              | [Sign-in](http://127.0.0.1:3300/sign-in?lang=pt-BR) · [API](http://127.0.0.1:4300/api/ready) | `juno-uat`                | 5      | `5a8947feceab0867d9ba81c3d3a163200ff8c1cf` |
| Original Shell          | [Sign-in](http://127.0.0.1:3301/sign-in?lang=pt-BR) · [API](http://127.0.0.1:4301/api/ready) | `juno-uat-shell`          | 5      | `33c3cc6c52e7cffccba982efeaaa6239f507def9` |
| Organization Management | [Sign-in](http://127.0.0.1:3302/sign-in?lang=pt-BR) · [API](http://127.0.0.1:4302/api/ready) | `juno-uat-org`            | 8      | `72ba6be66715178a750b042fa97c1320d2b7fb1e` |
| Redesigned Shell        | [Sign-in](http://127.0.0.1:3303/sign-in?lang=pt-BR) · [API](http://127.0.0.1:4303/api/ready) | `juno-uat-shell-redesign` | 5      | `4f6ab8f56bc94cecf9ece5651e1d42d7cd63c0c7` |

- **Foundation.** Sign-in, onboarding, design system and onboarding audit. Maintainer accepted the original Foundation snapshot. The authenticated Shell redesign and organization directory are outside this preview.
- **Original Shell.** Original workspace switcher, responsive Shell, invitations and role-dependent links. Visual and navigation acceptance was declined. Keep as a comparison environment.
- **Organization Management.** Directory, filters, detail, settings and audited profile changes on the earlier Shell. Lifecycle and new role policies are outside scope. Human acceptance pending.
- **Redesigned Shell.** Persistent rail, compact and mobile navigation, account controls, breadcrumbs and consistent administration. The header displays the preview revision. The design approval was recorded separately. Runtime acceptance is pending. The dependent Organization UI is outside this snapshot.

### Exact included revisions

- **Foundation.** The [snapshot record](history/JUNO-0037-uat-preview.md) pins #22, #23, #24, #26, #27, #29, #31, #33, #34, #35 and #36 with every exact head. The running application input is `0c7b49a0e0d12c981fe60f352b1f166d05dfeb5e`. The outer commit adds the historical #36 QA-only delta.
- **Original Shell.** Main `3053a7beab1ec657305634c77df46efe4ec472f1`, plus #36 `7c17cc435d863e5b43c4a8302b2ad8ec730828eb` and #37 `a7825a6b814013527414e7478fa77d5b2d3eb60c`. See the [original Shell guide](uat-shell-candidate.md).
- **Organization Management.** Main `c93ca1c7a372396cce1880b01d55171db3262a84`, #46 `ef8a1dfc2c44779721de3daf187ac40e561dbc47`, #36 and original #37 above, #40 `7d7f7a447e56159bbdc7eb6587e7fcaaa564c23d`, #41 `46b1a9408077d1a2564bdc403d158a8ebb294ec6`, #45 `588489f6ef2ef7bb141d868d097f0761bcec8f65`, #49 `0a2bd92fa68c79e01cfbaff22bc8df3635be8d0a`, #43 `e5de071650154641b9f08e7c0ba212d5e71def0a`, #48 `145cb9f726cc8d34b2c4c416ef0c08624b6dd562` and #51 `61534be066a32f94a5659e19007d1bad8998803a`. Its snapshot includes the runner overlap resolution and synthetic fixtures. The final #51 evidence commit does not change the running code. The [Organization guide](https://github.com/oEnzoRibas/Juno/blob/164c14a6dd29d80e5b33453c8e9f99b786d312a4/docs/development/uat-organization-candidate.md) covers testing.
- **Redesigned Shell.** Main `cce46311870af9854aeb4263517e2e42cf7fb007` includes #36 and #46. #37 app `5f8ecfc1ffeffe68043163229f8f317c7cdc3028`, regression input `1ec9ba6b6f76a8643800140916eafdee577c916d`. The current PR head `3101ac7a26e2b621d32c996138f8dc33f7d52cae` adds handoff, design notes and screenshots. See the [acceptance guide](https://github.com/oEnzoRibas/Juno/blob/3101ac7a26e2b621d32c996138f8dc33f7d52cae/docs/development/agents/agent-02/handoffs/JUNO-0027-redesign-uat.md).

### Start and stop a pinned environment

From the Codex session directory on the Windows host, select a Compose project from the table. These commands keep volumes and preserve the preview identity. Check that the expected snapshot in the table matches the output before starting.

```powershell
$project = 'juno-uat-shell-redesign'
$root = (Resolve-Path .\work).Path
$tree = Join-Path $root $project
$private = Join-Path $root "$project-private"
$envFile = Join-Path $private 'compose.env'
git -C $tree rev-parse HEAD
& (Join-Path $private 'Get-JunoUatCredentials.ps1')
$compose = @('compose','--env-file',$envFile,'-p',$project,'-f','compose.yaml')
if ($project -eq 'juno-uat-shell-redesign') {
    $compose += @('-f',(Join-Path $private 'preview.yaml'))
}
Push-Location $tree
docker @compose config --quiet
docker @compose up --no-build -d --wait
docker @compose ps -a
# When finished, standard shutdown retains the volumes.
docker @compose down
Pop-Location
```

The local helper decrypts synthetic credentials on the seeding Windows account. Keep them and invitation links out of PRs and screenshots. If a checkout, image or env file is unavailable, retain the database and restore from the pinned preview record before attempting a restart. The redesigned Shell has a local header marker. Older previews use the port, project and exact SHA table as their identity to preserve their tested application trees. An updated visual marker should be introduced on a newly approved candidate with separate data.
