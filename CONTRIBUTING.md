# Contributing to Juno

Executable pull requests need copyable exact-head review instructions, including how to start the environment, check the running image and API connection, obtain synthetic credentials, verify positive and negative scenarios, and stop safely. See the [runtime review guide](docs/testing/juno-review-runtime.md). A separate integrated UAT requires its own source pins and acceptance record.

## Start with a small change

See the [community guide](docs/governance/community.md) to route a question or proposal. Once labels are available, look for `good first issue` tasks with a bounded scope, acceptance criteria, and a maintainer contact. Documentation fixes, testing improvements, and accessibility reports are welcome. Ask on the issue before starting substantial work.

## Get set up

Fork the public Juno repository on GitHub. Replace `YOUR-ACCOUNT` below with your GitHub account. Replace `juno-nnnn` with the assigned task ID in the example. If you already have a checkout, inspect `git status` there and start from current upstream `main`.

```sh
git clone https://github.com/YOUR-ACCOUNT/juno.git
cd juno
git switch -c docs/juno-nnnn-tenant-invite-rules
```

Read the [local setup and documentation standards](docs/development/README.md), [architecture overview](docs/architecture/overview.md), and relevant specification before editing. Use the issue forms for bugs, features, integrations, documentation, and architecture. Use [private security reporting](SECURITY.md) for vulnerabilities.

When contributing through a designated development agent, follow the [coordination registry](docs/development/agents/README.md) and its worktree, ownership and handoff rules.

## Implement and submit

1. Keep changes focused. Write English source, identifiers, and technical documentation. Follow [.editorconfig](.editorconfig) and the conventions of the files you change. Document significant decisions in ADRs.
2. Follow the [testing standard](docs/testing/README.md). Add tests for changes in behavior, including denied authorization and tenant isolation where relevant. Use synthetic data and record actual results.
3. Preserve copyright and license notices. The [MIT License](LICENSE) applies to contributions to Juno software and its associated documentation. Contributors retain rights to their original work. The current contribution policy requires no copyright transfer. Flag uncertain third-party terms for review.
4. Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Use an English type and scope, such as `docs(architecture):`, followed by a short imperative description. Example commit message `docs(auth): specify tenant invitation lifecycle`. For breaking changes, use `!` after the type or scope or a `BREAKING CHANGE:` footer and describe migration.
5. Open a pull request against upstream `main`. Link the issue and relevant development task ID when assigned. Summarize impact, assumptions, tests, documentation, security, and meaningful AI assistance and verification. Respond to review and update the description if scope changes.

Use [containerized development](docs/development/docker.md) as the runtime onboarding reference and the [visual standard](docs/development/visual-documentation.md) for architecture diagrams.

Use the [Git workflow](docs/development/git-workflow.md) for task branches, atomic commits, native stacks for dependent work, ready status after local validation, and human-controlled merges. Independent PRs target main.

Use the [development protocol](docs/development/PROTOCOL.md) for owner-requested work and check the [definition of done](docs/development/DEFINITION_OF_DONE.md) before completion.

Read the [branching and release proposal](docs/governance/release.md), [AI disclosure](AI_DISCLOSURE.md), and [code of conduct](CODE_OF_CONDUCT.md).


## Evidence for maintainer review

Use the [pull request template](.github/pull_request_template.md) and follow the [maintainer review standard](docs/development/git-workflow.md#maintainer-review-standard). Provide exact refs, readable scope and dependencies, evidence embedded in the description, reproducible test instructions and a human acceptance checklist. Update the same pull request as its evidence or status changes.


## Issues and PR traceability

Register or reuse a [GitHub issue](https://github.com/oEnzoRibas/Juno/issues) for the work, record observable acceptance criteria, and link the task and issue in the PR. Use the [traceability workflow](docs/development/git-workflow.md#issue-and-pr-traceability) and existing labels. Use closing keywords only when the complete issue scope is delivered.
