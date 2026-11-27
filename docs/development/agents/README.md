# Juno development agents

The maintainer approved a bounded operational pilot. Agent 00 coordinates the [GitHub backlog](https://github.com/oEnzoRibas/Juno/issues), dispatches from a pinned worktree base and records active reservations in the execution checkpoint. [ASSIGNMENTS.md](ASSIGNMENTS.md) preserves historical claims.

| Agent            | Responsibility                                                | Record                                                        |
| ---------------- | ------------------------------------------------------------- | ------------------------------------------------------------- |
| JUNO-AGENT-00    | Dispatch, dependency coordination, integration and escalation | [Protocol](PROTOCOL.md)                                       |
| JUNO-AGENT-01    | Core domain, API, database and migrations                     | [Status](agent-01/STATUS.md) · [Worklog](agent-01/WORKLOG.md) |
| JUNO-AGENT-02    | Product design, UX and frontend engineering                   | [Status](agent-02/STATUS.md) · [Worklog](agent-02/WORKLOG.md) |
| JUNO-AGENT-03    | Platform engineering, DevOps, security and QA                 | [Status](agent-03/STATUS.md) · [Worklog](agent-03/WORKLOG.md) |
| Agent Researcher | Independent methods, evidence and living architecture views   | [Academic workflow](PROTOCOL.md#research)                     |

See the [historical execution checkpoints](EXECUTION_STATE.md) for earlier observations. Use the [coordination protocol](PROTOCOL.md), [ownership matrix](OWNERSHIP.md) and [handoff template](HANDOFF_TEMPLATE.md). Technical coordination is documented in [ADR-0011](../../architecture/adr/0011-three-agent-development.md).
