# Maintainer UAT testing guide

Use the exact commits and environment in the [preview checkpoint](history/JUNO-0037-uat-preview.md). The approved Windows preview runs on loopback only.

| Entry point | URL |
| --- | --- |
| English web | `http://127.0.0.1:3300/` |
| Brazilian Portuguese web | `http://127.0.0.1:3300/?lang=pt-BR` |
| Sign in | `http://127.0.0.1:3300/sign-in` |
| API readiness | `http://127.0.0.1:4300/api/ready` |
| OpenAPI | `http://127.0.0.1:4300/api/openapi.json` |

Use the local private PowerShell credential helper under the Windows account that set up the preview. The companion local operator guide holds the machine-specific path. The helper reads Windows DPAPI-encrypted accounts and invitations. Never commit the credential store or put passwords, tokens, or live invitation links in screenshots or reviews.

1. Sign in as the fixture platform administrator and open platform administration. Create a fictional organization and invite an administrator or member.
2. Open the invitation in a separate browser profile. Activate and sign in. Verify that one-time activation cannot be repeated.
3. Compare a tenant administrator with a regular member. Verify the invitation controls in the same tenant and a neutral denial in another tenant. The dual-membership account has a separate role in each organization.
4. Review the home language toggle, both color schemes, keyboard focus, narrow viewports, and distinct branding accents.
5. Inspect the OpenAPI contract if testing the audit and authorization APIs. The audit response shows event type and time to active administrators of the relevant tenant.

From the dedicated worktree, set `$uatEnv` to its private Compose environment file. Start the pinned image with `docker compose --env-file $uatEnv -p juno-uat up --no-build -d --wait` and stop with `docker compose --env-file $uatEnv -p juno-uat down`. The standard stop retains `juno-uat_database`. Use the [preview protocol](maintainer-uat.md) for an explicitly authorized update or reset. Verify the volume and a private backup before replacing data.

The candidate shell, member lifecycle, directorates, teams and projects are outside the first accepted preview. The application displays invitation links for manual sharing.
