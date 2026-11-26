# Exact-head review and runtime identity

Start with the PR's exact SHA and its own prerequisite, setup, positive, negative and teardown instructions. Document-only reviews can use the pinned diff and editable visual artifacts. Run code only from trusted revisions. Use a distinct loopback-only Compose project and synthetic accounts for persistent manual review. A disposable CI parity run normally removes its own containers, network, database volume and image tag when it exits. It does not launch a persistent environment.

## Build and verify a candidate

On a revision containing this provenance tooling, use Git, Node 24, Docker with Buildx and Compose v2. Supply a reviewed clean checkout and the isolated environment file defined by your PR or UAT runbook. Do not use a project's production database credentials or ports. The env file must be private, outside the worktree, with random distinct `JUNO_MIGRATION_PASSWORD` and `JUNO_DATABASE_PASSWORD`, free loopback `JUNO_WEB_PORT` and `JUNO_API_PORT`, and `JUNO_REVIEW_BUILD_INFO=1`. Integrated candidates must include each recorded input with `--include-pr NUMBER:FULL_SHA`; the helper verifies each input is an ancestor of the selected checkout. Record the source tree separately for cherry-picked historical compositions.

```powershell
$project = 'juno-review-unique-name'
# Set $reviewEnv to the full private env-file path, $apiPort to its JUNO_API_PORT.
node scripts/build/review-build.mjs --project $project --env-file $reviewEnv
docker compose -f compose.yaml --env-file $reviewEnv -p $project up --no-build --wait
docker compose -f compose.yaml --env-file $reviewEnv -p $project images
docker image inspect "juno-runtime:$project" --format '{{.Id}} {{index .Config.Labels "org.opencontainers.image.revision"}} {{index .Config.Labels "io.juno.source.tree"}}'
Invoke-RestMethod "http://127.0.0.1:$apiPort/api/build-info"
docker compose -f compose.yaml --env-file $reviewEnv -p $project exec -T web node -e 'const o=process.env.JUNO_API_ORIGIN;fetch(new URL("/api/ready",o)).then(async r=>{const data=await r.json();if(!r.ok||data.status!=="ready")process.exit(1);console.log(data.status)})'
```

Check that the observed web and API image IDs equal the planned image and that the API reports the same expected revision, tree and environment name. Its schema is read from the connected database. The response includes the build timestamp, copied-source digest and explicitly listed PR inputs. An image's Git stamp remains unchanged after a container restart. `docker compose build` without the pinned archive reports unavailable Git provenance. The development source-sync profile runs mutable frontend source. Keep build labels and operator-supplied pins distinct from live data.

Use the PR's provisioning scenario for local synthetic credentials. Stop with `docker compose -f compose.yaml --env-file $reviewEnv -p $project stop` to preserve the review database. Use `down --volumes` only after confirming the exact disposable project and intent to remove its data. Legacy preview operators should verify their pinned worktree and Compose project, retain the image ID for evidence, and mark compiled revision unavailable if their image predates this feature. Existing UAT snapshots must not be rebuilt just to make the revision appear.
