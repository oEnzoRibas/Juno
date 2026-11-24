# Containerized development

**Status:** Required architecture, planned implementation. The checkout has no runnable Dockerfiles or Compose configuration.

## Prerequisites and target

Use Git, a Docker environment for Linux containers, and the Compose plugin with v2-style commands. Verify installed tools with `git --version`, `docker version`, and `docker compose version`. Target Linux, Windows with WSL2, and macOS on x86-64. Validate ARM64 when base images and native dependencies support it. Publish the supported platform matrix after validation. Evaluate bind-mount performance on WSL2 and macOS.

The intended path is clone, copy safe values from `.env.example`, and use Compose to start the development stack. Evaluate a base plus an explicit development overlay and a unique project name such as `juno-example-dev` for each developer. Publish working commands after a clean-checkout run.

| Operation | Target behavior |
| --- | --- |
| Start and reload | Build from locked dependencies, bind-mount sources and expose configurable UI ports on loopback. |
| Observe and debug | Follow logs and readiness. Enable a loopback debugger explicitly. |
| Migrate and seed | Wait for the database, run controlled migrations and seed synthetic records in the developer project. |
| Test | Run containerized quality gates with separate test instances, credentials and volumes. |
| Stop and restart | Preserve volumes on ordinary shutdown. Restrict destructive reset procedures to a confirmed disposable environment. |

Each contributor's stack runs independently with private service discovery and development-only credentials. See [container design](../architecture/containers.md) and [self-hosting](../deployment/README.md).
