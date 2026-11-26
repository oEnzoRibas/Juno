# Development coordination protocol

When handing off an executable PR, identify the reviewed commit, actual image or legacy provenance limitation, Compose project, exact startup and cleanup, frontend-to-API verification, synthetic account setup and retrieval, expected outcomes and tests actually run. Provide a separate ref and runbook for any integrated preview. Coordination claims must distinguish CI, agent execution and maintainer observations.

Agent 01 allocates IDs and updates the [central queue](../QUEUE.md) and the [assignment registry](ASSIGNMENTS.md). A single registry branch may be used while the coordination change awaits review. Use its published revision as the current operating record. Agent worktrees record their status and evidence under their agent directory.

Select the earliest eligible task for each free owner. Up to three agents can hold one active implementation claim each. Review-stage work releases its execution slot. Later independent work may advance past a blocked or review-stage task. Record the reason, unchanged priority, and condition for resumption. An active claim includes its ID, owner, scope, reserved paths, branch, exact base SHA, dependencies and necessary handoffs. Publish the claim before the assignee edits. Verify a clean status and independent worktree. A silent session never releases a claim. Reassignment requires a documented decision and preservation of existing work.

## Assignment and execution states

Record task ownership separately from execution. An assignment authorizes work within its reserved paths. Starting a separate Codex session requires evidence. Store the source, timestamp, acknowledged registry revision, last verified worktree or branch, exact commit, validation and next action in the [execution checkpoint](EXECUTION_STATE.md). Keep separate records when the owner reports on an independent session and a delegated execution publishes work for the same assigned role.

| State                   | Evidence and effect                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Task assigned           | Agent 01 published an owner, task, reserved paths, branch, base revision, dependencies and handoff.                                   |
| Assignment acknowledged | The named recipient confirms receipt and identifies the registry revision and base.                                                   |
| Agent executing         | Observed action or an explicit current status confirms the session is active in its isolated worktree.                                |
| Agent paused            | The recipient reports a voluntary stop or a deliberate checkpoint. Preserve the claim and its next action.                            |
| Agent interrupted       | An external stop or interruption was observed or reported. Preserve uncommitted work and record the last verified checkpoint.         |
| Agent blocked           | A specific dependency, permission or other condition prevents progress. Record validation and the resumption condition.               |
| Agent awaiting review   | A scope has been published for review, with exact commit, PR and validation. Update related task claims to reflect the review stage.  |
| Task completed          | The task's acceptance, review and applicable merge requirements were verified. A stopped session does not complete its assigned task. |

Publish and consume the canonical registry from its exact Git revision, including an accepted or owner-authorized coordination change in an open PR. Independent eligible work may proceed against its own verified base while governance review is open. Shared code dependencies still require the exact upstream contract and base. Pause and interruption never grant a second owner access to edit reserved paths. The returning agent verifies its worktree, branch and checkpoint, then acknowledges the latest published revision before resuming. Agent 01 documents any deliberate reassignment and handoff.

## Conflicts and handoffs

For task-scoped specialists, see the [agent harness](../harness/README.md#roles-and-use). The owning lane remains accountable for scope and handoff. A specialist's tool profile is inherited from its parent session. Keep independent verification separate from the authoring execution and checkpoint interruptions with exact repository evidence.

When revisions conflict, stop edits to the shared path, publish the conflict and evidence, and let Agent 01 negotiate ordering or transfer. Change reservations before resuming. Verify remote branch ownership before any history operation. Follow the [Git workflow](../git-workflow.md) for atomic commits, focused PRs, native linear stacks where the dependency fits, and required human approval. Parallel siblings keep correct bases and are not chained solely to obtain native stack metadata.

Handoffs record contract revisions, exact SHA, PR, files, dependencies, validation, limits and next action. A receiving owner verifies evidence and records acknowledgement when observed. Repository publication is the shared channel. Account for separate tool state and conversational memory. Read the [ownership rules](OWNERSHIP.md) before touching shared inputs.

All agents update their own module documentation, code conventions, diagrams when relevant, and test evidence. Use TSDoc and TypeDoc when applicable. Follow [Juno documentation standards](../DOCUMENTATION.md), [Google developer documentation style](https://developers.google.com/style) and concise Doxygen-inspired API descriptions. Keep technical content, commits and PR bodies in English. Preserve MIT terms, Enzo Ribas's original creator attribution and AI-assistance disclosure. Human owners approve changes requiring a project decision and control merges.

## Maintainer acceptance testing

Use an explicitly pinned local [maintainer preview](../maintainer-uat.md) for owner acceptance. Agent publication never replaces the running preview or its volume. Keep each agent’s assigned work and environment independent.

## Maintainer review coordination

Agent 01 maintains scope, integration, governance and the published registry. Agent 02 verifies frontend evidence, concepts, interaction captures and accessibility review. Agent 03 verifies disposable infrastructure, security, testing and reproducibility. Each lane hands off exact refs, dependencies and evidence. Agent 01 checks coverage and cross-lane consistency before applying the [review standard](../git-workflow.md#maintainer-review-standard). An assigned or completed task does not imply a running independent session.

## Shared GitHub traceability

Agent 01 coordinates issue registration, task ownership, the [traceability index](../traceability.md) and consistency with the assignment registry. Agents 02 and 03 follow the same issue and label rules and hand off verified status changes, exact refs and evidence. Use the [Git workflow](../git-workflow.md#issue-and-pr-traceability).
