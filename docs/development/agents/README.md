# Juno development agents

[ASSIGNMENTS.md](ASSIGNMENTS.md) is the only active ownership and path reservation registry. Agent 01 publishes its branch and exact revision. Read that revision and verify it against the latest coordinator handoff before editing. The [central queue](../QUEUE.md) remains authoritative for order and the task records for acceptance evidence.

| Agent | Responsibility | Record |
| --- | --- | --- |
| JUNO-AGENT-01 | Core engineering and technical coordination | [Status](agent-01/STATUS.md) · [Worklog](agent-01/WORKLOG.md) |
| JUNO-AGENT-02 | Product design, UX and frontend engineering | [Status](agent-02/STATUS.md) · [Worklog](agent-02/WORKLOG.md) |
| JUNO-AGENT-03 | Platform engineering, DevOps, security and QA | [Status](agent-03/STATUS.md) · [Worklog](agent-03/WORKLOG.md) |

Use the [coordination protocol](PROTOCOL.md), [ownership matrix](OWNERSHIP.md) and [handoff template](HANDOFF_TEMPLATE.md). Technical coordination is documented in [ADR-0011](../../architecture/adr/0011-three-agent-development.md).
