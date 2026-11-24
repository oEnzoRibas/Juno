# ADR-0011 — Three-agent development architecture

**Status:** Accepted by the project owner on 2026-11-24. See [JUNO-0034](../../development/tasks/JUNO-0034.md) and its [source brief](../../development/history/JUNO-0034-owner-request.md).

## Context and decision

Juno's backend, frontend and infrastructure can advance concurrently after shared contracts are agreed. Use three engineering agents with a single technical coordinator. Agent 01 owns the architecture and core application, Agent 02 owns product design and frontend engineering, and Agent 03 owns platform, independent security validation and QA. This is a development process. Juno's modular-monolith runtime gains no agent components or provider dependencies.

## Execution and oversight

Use dependency-aware FIFO with one active implementation claim per agent. Agent 01 publishes task IDs, base SHAs, path reservations, dependencies and handoffs in the authoritative registry. Each agent works in an independent Git worktree and documents its changes. Negotiate conflicts and compatibility before changing shared paths or contracts. Agent 01 manages stack dependencies and protects other agents' branches. Human owners retain architecture approvals and merge decisions.

Use the existing automated and independent validation gates. Agent 03 reports validation and security evidence to the owning agent. Keep contributor attribution and preserve the accepted documentation and diagram standards. See the [coordination protocol](../../development/agents/PROTOCOL.md) and [ownership matrix](../../development/agents/OWNERSHIP.md).

## Consequences and risks

Parallel work improves independent throughput and introduces risk of stale context, duplicate implementations, merge conflicts and premature authorizations. Use one canonical revision, explicit ownership, reproducible base SHAs, isolated worktrees, versioned handoffs, and a documented review boundary. Compare with the alternatives of a single serial owner or two agents. Those reduce coordination overhead but leave independent validation and infrastructure competing with engineering capacity. Retain existing branches and complete or transfer in-flight work.
