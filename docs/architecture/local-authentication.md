# Local authentication

A platform operator creates a platform administrator from the Compose migration service. Network clients cannot bootstrap accounts or assign platform administration. Use a new address, a unique password and an isolated development project. The command reads one JSON object with `email` and `password` from standard input.

```sh
docker compose run --rm -T migrate pnpm --filter @juno/api bootstrap-admin
```

Supply the object through a trusted input channel that avoids shell history and logs. The command rejects existing accounts and never changes their roles. Juno uses versioned scrypt password hashes and 256-bit opaque sessions. It stores only session digests, rejects expired sessions, and revokes the digest on sign-out. Time-bucketed source and account limits protect login. API credential reads use narrow database functions and a non-login role.

The web app calls the API from the server and stores its session in an HttpOnly, SameSite Strict cookie. HTTPS deployments use the Secure, host-only cookie by default. The loopback-only Compose profile enables a local HTTP cookie through `JUNO_ALLOW_INSECURE_LOCAL_COOKIE`. Keep that setting disabled when exposing the web listener outside local development. The API accepts a bearer token and only the web process receives it in the browser flow.

| Route | Purpose |
| --- | --- |
| `POST /api/auth/sign-in` | Exchange a local email and password for a short-lived API bearer token. |
| `GET /api/auth/session` | Verify the session and return the account identity and platform role. |
| `POST /api/auth/sign-out` | Revoke the session. |

The local smoke test uses a disposable browser profile and synthetic bootstrap account. Set `JUNO_TEST_ADMIN_EMAIL` and `JUNO_TEST_ADMIN_PASSWORD` in the local process, then run `pnpm exec playwright test`. Set `JUNO_SMOKE_WEB` and `JUNO_SMOKE_API` for non-default origins. Install Chromium with `pnpm exec playwright install chromium`, or set `JUNO_BROWSER_CHANNEL=chrome` to use installed Chrome. Avoid uploading artifacts that include synthetic credentials or session cookies.

Tenant invitations, membership-based API authorization and tenant dashboard views build on this authentication layer. See [tenant isolation](tenancy.md) and [security reports](../../SECURITY.md).
