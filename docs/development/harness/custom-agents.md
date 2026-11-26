# Project-scoped Codex specialists

These profiles support scoped delegation under the [existing ownership protocol](../agents/PROTOCOL.md). The three persistent lanes retain ownership. Each specialist receives an exact input revision and a finite assignment. A profile neither grants additional tools nor creates an independent sandbox.

| Profile                     | Use when                                                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------- |
| `juno-architecture-review`  | A proposed ADR or module contract changes dependencies or coordination.                     |
| `juno-backend-review`       | Independent review of API, migration, audit or tenant boundaries.                           |
| `juno-design-review`        | Independent V2 UI or native creative evidence needs visual and accessibility judgment.      |
| `juno-platform-review`      | Exact-head Compose, SQL execution, runtime identity or failure recovery needs verification. |
| `juno-photoshop-specialist` | A scoped native PSD operation uses the local qualified Photoshop workflow.                  |

Run `codex --version` and verify project trust for your own checkout before trying custom agents. In a supported session, explicitly ask for the specialist by name and supply its scope, relevant skill, exact heads, output and stop condition. Use the parent session's appropriate permissions. An unavailable profile can be substituted with the same scoped instructions in a built-in temporary agent. Preserve independent review and use the registry when an assignment needs a different owner.

The project config contains only the documented `agents.max_concurrent_threads_per_session` field. The five standalone TOMLs contain the documented `name`, `description` and `developer_instructions` fields. No local paths, permission settings, model overrides or MCP declarations are checked in.

On Windows with CLI 0.169.1, the TOMLs parsed, the CLI accepted the concurrency field under strict config, and the local app-server schema and `config/read` returned it for a session override. The default app-server session identified the linked project layer as untrusted. This verification did not authorize project trust or prove custom-profile discovery and spawning. Delegation through the already authorized host tools was observed separately. See the official [multi-agent guide](https://learn.chatgpt.com/docs/multi-agent), [configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) and [permissions guide](https://learn.chatgpt.com/docs/permissions).
