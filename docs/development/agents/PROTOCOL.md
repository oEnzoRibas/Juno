# Development coordination protocol

When handing off an executable PR, identify the reviewed commit, actual image or legacy provenance limitation, Compose project, exact startup and cleanup, frontend-to-API verification, synthetic account setup and retrieval, expected outcomes and tests actually run. Provide a separate ref and runbook for any integrated preview. Coordination claims must distinguish CI, agent execution and maintainer observations.

During the approved operational pilot, Agent 00 owns GitHub backlog, dispatch and integration. Select the earliest eligible work from the approved order and record any justified exception in the issue. Cap executing implementation workers at three and deliveries awaiting maintainer review at two. Independent eligible work may proceed from a verified base. Preserve path reservations across interruptions.

Before dispatch, pin the base, scope, owner, writable paths, dependencies and expected evidence in one durable execution checkpoint. Use verified native handoffs. Assignment, acknowledgement and observed execution remain distinct. The coordinator reconciles the checkpoint before releasing a parked claim. GitHub is the live source for issue and PR disposition. A custom scheduler is optional.

## Assignment and execution states

Record task ownership separately from execution. An assignment authorizes work within its reserved paths. Starting a separate Codex session requires evidence. Record the source, timestamp, last verified worktree and commit, checks and next action in the current execution checkpoint. The [historical records](EXECUTION_STATE.md) preserve earlier observations. Keep separate records when the owner reports on an independent session and a delegated execution publishes work for the same assigned role.

| State                   | Evidence and effect                                                                                                                   |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Task assigned           | Agent 00 issued a pinned scope and reserved paths.                                                                                    |
| Assignment acknowledged | The named recipient confirms receipt and identifies the registry revision and base.                                                   |
| Agent executing         | Observed action or an explicit current status confirms the session is active in its isolated worktree.                                |
| Agent paused            | The recipient reports a voluntary stop or a deliberate checkpoint. Preserve the claim and its next action.                            |
| Agent interrupted       | An external stop or interruption was observed or reported. Preserve uncommitted work and record the last verified checkpoint.         |
| Agent blocked           | A specific dependency, permission or other condition prevents progress. Record validation and the resumption condition.               |
| Agent awaiting review   | A scope has been published for review, with exact commit, PR and validation. Update related task claims to reflect the review stage.  |
| Task completed          | The task's acceptance, review and applicable merge requirements were verified. A stopped session does not complete its assigned task. |

Verify shared code dependencies from published or handed-off exact revisions. Governance review can proceed separately. A returning worker verifies the checkpoint, branch and path reservations before editing. Agent 00 records deliberate reassignment and preserves existing work.

## Conflicts and handoffs

When revisions conflict, stop edits to the shared path, publish the conflict and evidence, and let Agent 00 negotiate ordering or transfer. Change reservations before resuming. Verify remote branch ownership before any history operation. Follow the [Git workflow](../git-workflow.md) for atomic commits, focused PRs, native linear stacks where the dependency fits, and required human approval. Parallel siblings keep correct bases and are not chained solely to obtain native stack metadata.

Handoffs record contract revisions, exact SHA, PR, files, dependencies, validation, limits and next action. A receiving owner verifies evidence and records acknowledgement when observed. Use direct native delivery and durable evidence links. Account for separate tool state and conversational memory. Read the [ownership rules](OWNERSHIP.md) before touching shared inputs.

All agents update their own module documentation, code conventions, diagrams when relevant, and test evidence. Use TSDoc and TypeDoc when applicable. Follow [Juno documentation standards](../DOCUMENTATION.md), [Google developer documentation style](https://developers.google.com/style) and concise Doxygen-inspired API descriptions. Keep technical content, commits and PR bodies in English. Preserve MIT terms, Enzo Ribas's original creator attribution and AI-assistance disclosure. Human owners approve changes requiring a project decision and control merges.

## Maintainer acceptance testing

Use an explicitly pinned local [maintainer preview](../maintainer-uat.md) for owner acceptance. Agent publication never replaces the running preview or its volume. Keep each agent’s assigned work and environment independent.

## Maintainer review coordination

Agent 00 maintains scope, integration, governance and the published registry. Agent 02 verifies frontend evidence, concepts, interaction captures and accessibility review. Agent 03 verifies disposable infrastructure, security, testing and reproducibility. Each lane hands off exact refs, dependencies and evidence. Agent 00 checks coverage and cross-lane consistency before applying the [review standard](../git-workflow.md#maintainer-review-standard). An assigned or completed task does not imply a running independent session.

## Shared GitHub traceability

Agent 00 coordinates issue registration, task ownership, the [traceability index](../traceability.md) and consistency with the assignment registry. Agents 02 and 03 follow the same issue and label rules and hand off verified status changes, exact refs and evidence. Use the [Git workflow](../git-workflow.md#issue-and-pr-traceability).

## Research

Agent 00 dispatches evidence-driven research and receives independent recommendations. Researcher is a logical role without a permanent implementation slot. Collect research-safe task, agent, execution, commit, PR, validation, architecture revision and observation links from all four operational roles. Retain failures and human decisions. Researcher verifies evidence, owns conclusions and experimental ground truth, and maintains the living orchestration views and private Notebook.

Resume from the last verified research revision, inspect only the intervening changes, and checkpoint the new revision. Record significant interventions as they occur. Consolidate the Notebook weekly and scientific findings monthly. Scheduling feasibility and actual unattended execution require separate observed evidence. Research proceeds alongside product delivery.
