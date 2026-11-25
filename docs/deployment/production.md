# Production Compose reference

This initial production profile builds the versioned source and runs compiled Juno in Linux containers. It is intended for independently operated installs. Use Docker Engine and the Compose plugin on a Linux host with an operator-managed domain, HTTPS proxy, and private storage. Linux amd64 is the qualification target. Minimum CPU, memory, storage, and other architectures require operator measurements and upstream qualification before a supported release. The host does not need Node.js, pnpm, a hosted database, a Juno account, or a code editor.

## Prepare and start

Use the same unique Compose project name and private environment file for the lifetime of the installation. Copy [production.env.example](production.env.example) to a restricted file outside the checkout and fill it with distinct randomly generated credentials. Use each value only for its installation. Use at least 16 characters for each database password, and prefer 32 random bytes encoded as hex. Restrict access to the env file, Docker, volumes, and backups. Docker administrators can inspect container environments. Keep the credentials out of source, shell history and support reports.

From the exact source checkout, set an absolute `JUNO_ENV` path. The helper below is a shell function for the operator's terminal.

```sh
juno() { docker compose --env-file "$JUNO_ENV" -p acme-juno -f compose.production.yaml "$@"; }

juno config --quiet
juno build migrate
juno up --no-build -d --wait
juno ps -a
```

One local image supplies the compiled API, web, and migration command. A named PostgreSQL volume holds current application state. Local files and future object storage are outside this initial slice. The migration service must exit successfully before the API starts. The web waits for database-backed API readiness. The private API and database have no host-published ports. The web listens on loopback so the host reverse proxy can reach it. The existing Dockerfile uses pinned build inputs and a frozen lockfile. Build-time artifact access is separate from runtime operation. Optional published OCI images require an approved release and a qualified artifact flow.

## HTTPS ingress

Point the domain's DNS to the operator's host, obtain a certificate for it, and configure an HTTPS virtual host in the operator's reverse proxy. Redirect HTTP traffic to the HTTPS origin. A same-host Nginx example follows. Replace the host and certificate paths and adapt the loopback port to the installation.

```nginx
server {
    listen 443 ssl;
    server_name juno.example.org;
    ssl_certificate /operator/certs/fullchain.pem;
    ssl_certificate_key /operator/certs/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

Only HTTPS ingress should receive user traffic. Firewall or topology changes must keep the API and PostgreSQL private. The production web uses the existing Secure, HttpOnly, SameSite=Strict host cookie. Preserve the public host through the proxy so server actions can match their origin. Verify certificate renewal and browser sign-in before onboarding users.

## Bootstrap and first organization

Prepare one private UTF-8 JSON input containing `email` and `password`. Use a unique strong password for the installation administrator. Supply it on stdin to the existing compiled bootstrap command:

```sh
juno run --rm -T migrate node dist/auth/bootstrap-admin.js < "$JUNO_BOOTSTRAP_INPUT"
```

Store the credential in the operator's password manager and retire the temporary input according to local policy. Bootstrap creates the named local administrator. A duplicate account is rejected. Sign in at the HTTPS domain, open platform administration, create the first fictional workspace, and issue an invitation to its first tenant administrator. See the [onboarding walkthrough](../architecture/tenant-onboarding.md). Repeat the same workflow for additional organizations on a multi-organization instance.

## Operate and recover

- Check `juno ps -a` and `juno logs --tail=80 migrate api web db` when startup fails. Check the stopped migration exit code first. Verify the private credentials and installed schema without printing resolved configuration or secrets.
- Check internal API readiness with `juno exec -T api node -e "fetch('http://127.0.0.1:3001/api/ready').then(r=>{console.log(r.status);process.exitCode=r.ok?0:1})"`. Check the public HTTPS sign-in page separately so DNS, TLS and proxy failures are distinguishable.
- Use `juno down` for ordinary shutdown and retain the named database volume. Keep an encrypted, access-controlled logical backup and verify a restore into a separate disposable instance. An installation-specific retention and recovery target belongs to the operator.
- Record the current source SHA or image digest and snapshot the database before updates. Review migration compatibility and test the same update on a separate restored copy. A rollback requires a schema-compatible previous image or a verified recovery into a separate volume from a pre-upgrade backup. Qualification of production data recovery objectives and supported version pairs remains a release gate. The [local recovery validator](../testing/juno-database-recovery.md) exercises controlled PostgreSQL restart independently.
- When HTTPS login fails, inspect the certificate, external host headers and browser cookie policy. When readiness fails, inspect database connectivity, disk space and migration status. Use a separate project name and loopback port for all rehearsals.

This source-build reference leaves official release publication and provider choice with the maintainer and operator. The [installation task](../development/tasks/JUNO-0038.md) owns the remaining release gates.

## Qualification evidence

A disposable Linux amd64 Compose installation on 2026-11-24 verified private API and PostgreSQL, loopback-only web ingress, migrations, readiness, local administrator bootstrap, two fictional organizations, invitation activation and cross-tenant denial. Chromium signed in through a local TLS reverse proxy using an isolated self-signed test certificate. The session cookie was Secure, HttpOnly, SameSite=Strict and used the required host prefix. A normal stop/start preserved both organizations. The disposable project was removed after verification. Public DNS, certificate renewal, supported upgrade pairs, release image publishing and a production load target were outside the rehearsal.

See the [independent installation and restore qualification](../testing/juno-production-installation.md) for the reproducible test and release gates.
