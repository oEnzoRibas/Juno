# Multi-agent coordination workflow

**Status** Accepted development workflow, 2026-11-24.

Agent 01 records task IDs, exclusive ownership, exact base commits and path reservations before implementation. Agents work in isolated worktrees and publish check results, dependencies and handoffs. Independent changes target the shared base. Dependent changes keep an incremental comparison and use native GitHub stack metadata where supported. Human approval controls merges. A blocked claim stays documented while another eligible task proceeds.

- [Editable Draw.io master](juno-multi-agent-coordination-workflow.drawio)
- [SVG export](juno-multi-agent-coordination-workflow.svg)
- [PDF export](juno-multi-agent-coordination-workflow.pdf)
- [Original owner-supplied PDF](references/juno-multi-agent-coordination-workflow.pdf)

The editable master retains the layout and line icons of the supplied reference. It uses Arial for portable editable text and native Draw.io connectors for the workflow. The preserved source retains its original typography.

See the [assignment registry](https://github.com/oEnzoRibas/Juno/blob/056183165bced5339c66b4c0674fc70bcf599a8e/docs/development/agents/ASSIGNMENTS.md), [ADR-0011](https://github.com/oEnzoRibas/Juno/blob/056183165bced5339c66b4c0674fc70bcf599a8e/docs/architecture/adr/0011-three-agent-development.md), and [JUNO-0035](https://github.com/oEnzoRibas/Juno/blob/056183165bced5339c66b4c0674fc70bcf599a8e/docs/development/tasks/JUNO-0035.md).

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
