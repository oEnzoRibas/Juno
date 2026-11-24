# Development protocol

The repository is the authority for Juno's workflow. This protocol governs development workflow conflicts. Preserve approved product, brand, MIT, and attribution decisions. Keep technical records in English. Work proceeds during an active execution session.

## Recover a session

1. Read AGENTS.md, [STATE.md](STATE.md), and [QUEUE.md](QUEUE.md) before implementation.
2. Verify the repository and inspect the working tree with `git status --short --branch`, `git diff`, `git diff --cached`, and an inventory of untracked files. Preserve human and contributor changes.
3. Read the active task, relevant [ADRs](../architecture/adr/README.md) and module docs. Compare the last checkpoint with files and actual validation. Investigate discrepancies and record the reconciliation before proceeding.
4. Resume the active assignment from the last verified checkpoint. If it is blocked, record what would unblock it and follow the exception policy below.

## Register and select work

1. For each owner implementation request, allocate the next unused sequential `JUNO-NNNN` identifier across all task records, including terminal ones. Start with [TASK_TEMPLATE.md](TASK_TEMPLATE.md). Save the original requirements in the task or a linked history snapshot. In a public repository, redact sensitive material and record that redaction.
2. Record scope, dependencies, and measurable acceptance criteria. Append the task to [QUEUE.md](QUEUE.md) in FIFO order, and log registration. Keep the current assignment active when another request arrives.
3. When the active assignment ends or legitimately yields, select the earliest eligible task. Preserve the position of blocked tasks relative to their peers. Log any bypass or reordering with the reason, affected tasks, old and new order, and resumption condition. One primary implementation task is the default. Record the justification and safe boundaries for any authorized parallel work.
4. Use [QUEUE.md](QUEUE.md) as the authority for ordering and active assignment. Use each task document for lifecycle status and acceptance evidence. Use [STATE.md](STATE.md) for the last verified checkout and next action, and [WORKLOG.md](WORKLOG.md) for chronology. If adding machine-readable queue data later, designate one authoritative source and generate other queue views from it.

## Lifecycle and exceptions

| Status | Meaning |
| --- | --- |
| QUEUED | Registered and awaiting an eligible slot. |
| IN_PROGRESS | The assigned task is being implemented. |
| BLOCKED | A documented dependency, validation blocker, or explicit suspension prevents progress. |
| IMPLEMENTED | The required changes exist and need verification or documentation review. |
| VALIDATING | Required checks are running or being reviewed. |
| DOCUMENTING | The task is reconciling its required technical records or handoff. |
| COMPLETED | Every applicable gate in the [definition of done](DEFINITION_OF_DONE.md) passed. |
| CANCELLED | Explicitly cancelled. Preserve the reason and any partial work. |

Documentation evolves during implementation. A failed check can return a task to IN_PROGRESS, or BLOCKED if progress requires external input or a dependency. Log significant transitions. Record blockers, attempted remedies, their results, and a specific condition to resume. Proceed with eligible independent work if appropriate.

Exceptions to FIFO require an explicit owner decision, a critical security vulnerability, data integrity risk, blocking technical dependency, broken build, critical regression, or explicit cancellation or suspension. Preserve all task records and their identifiers. An owner amendment to the active task is recorded on that task. A separate implementation request receives its own task.

## Git and review states

Apply the Git workflow. After local implementation and verification, use PR_DRAFT for a draft, AWAITING_REVIEW for ready work, CHANGES_REQUESTED for actionable review, APPROVED for documented human approval, and MERGED for a verified merge. A ready or approved PR does not establish merge or completion. Once published, mark COMPLETED only after the required acceptance and merge evidence is recorded. Earlier local-only tasks retain the status and authorization that applied at completion.

Keep review-stage work in a separate review section of the authoritative queue. Independent work may continue. Block dependent tasks or document an explicit stack and correct base. Resume changes on the existing branch and record actual status transitions.

## Checkpoint and hand off

After a meaningful milestone, architecture decision, migration, dependency, security or integration change, failed or successful validation, blocker, or completion, update the task and STATE. Log the transition or event in WORKLOG. Record what changed, why, how, requirements met, relevant alternatives, affected files and docs, tests, and limitations.

Before ending a session, persist the active task and status, files changed, completed and remaining work, ADRs, documentation, actual results and failures, open questions, next action, and Git considerations. Update the queue if selection changed. Link terminal task records from [history](history/README.md). Subsequent sessions must be able to resume from these files and Git evidence.
