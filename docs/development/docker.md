# Containerized development

Use Git and Docker with Linux containers and the Compose plugin. The starter was exercised on Linux amd64 through Docker Desktop on Windows. The pinned image manifests also include arm64. Run the same checks on arm64 before advertising platform support.

Copy [.env.example](../../.env.example) to `.env` and fill in distinct random passwords of at least 16 characters. Use synthetic values and keep the file local. The migration password initializes the development database. The runtime password is used by the API. `JUNO_WEB_PORT` and `JUNO_API_PORT` default to 3000 and 3001.

```sh
docker compose config --quiet
docker compose up --build -d --wait
node scripts/runtime-smoke.mjs
docker compose down
```

Open `http://127.0.0.1:3000`. Set `JUNO_SMOKE_WEB` and `JUNO_SMOKE_API` to the custom origins when using different ports. Compose starts PostgreSQL, runs the one-shot migration, then starts the API and web. Shutting down preserves the named database volume.

For contributor reload, use `docker compose -f compose.yaml -f compose.dev.yaml up --watch`. The watch overlay syncs frontend source and rebuilds the API on source edits. To run a parallel project, set a different Compose project name and use separate local ports and credentials.

The [container architecture](../architecture/containers.md) documents the service boundaries. See the [database runbook](../architecture/database-runtime.md) for roles and migration behavior. The base images pin the official Node 24 Bookworm Slim and PostgreSQL 17 Bookworm multi-platform digests in the Dockerfile and Compose file.
