# Development setup

## Phase 0 local checks

Use Git and a UTF-8 editor with Markdown and YAML support. For a clone, follow [contributing](../../CONTRIBUTING.md). For an existing checkout, read [STATE](STATE.md), [QUEUE](QUEUE.md), and the [recovery procedure](PROTOCOL.md) before editing.

```sh
git status --short --branch
git ls-files
git diff --check
git diff --cached --check
```

See [containerized development](docker.md) for the approved Docker environment and planned onboarding. Phase 0 has no build, installation, migration, test runner, or service startup commands. [.env.example](../../.env.example) declares no runtime settings. Add future settings with purpose, expected values, default, required environments, and sensitivity. Store actual secrets in ignored files or an appropriate secret store.

## Development records and standards

| Record | Purpose |
| --- | --- |
| [QUEUE](QUEUE.md) and [STATE](STATE.md) | Live order and active assignment, plus the verified resumption point. |
| [WORKLOG](WORKLOG.md) and [history](history/README.md) | Chronological checkpoints and retained task records. |
| [Task template](TASK_TEMPLATE.md) | Registration, acceptance criteria and evidence. |
| [Definition of done](DEFINITION_OF_DONE.md) and [quality gates](../testing/README.md) | Completion criteria and applicable checks. |
| [Documentation standard](DOCUMENTATION.md), Git workflow, and [ADRs](../architecture/adr/README.md) | Technical content, source attribution and decision records. |

Inspect new files separately for UTF-8, whitespace, links and applicable form or diagram syntax. Git diff checks cover tracked or staged changes. Add a CI job only with a runnable clean-checkout command and a defined outcome.

## Troubleshooting

If expected files are missing, use `git rev-parse --show-toplevel`. If local settings appear in status, run `git check-ignore -v .env` and verify the file has not already been tracked. If a link breaks after a move, correct its relative target and check that the target is included in the change.
