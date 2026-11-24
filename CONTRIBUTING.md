# Contributing to Juno

## Start with a small change

See the [community guide](docs/governance/community.md) to route a question or proposal. Once labels are available, look for `good first issue` tasks with a bounded scope, acceptance criteria, and a maintainer contact. Documentation fixes, testing improvements, and accessibility reports are welcome. Ask on the issue before starting substantial work.

## Get set up

Fork the public Juno repository on GitHub. Replace `YOUR-ACCOUNT` below with your GitHub account. Replace `juno-nnnn` with the assigned task ID in the example. If you already have a checkout, inspect `git status` there and start from current upstream `main`.

```sh
git clone https://github.com/YOUR-ACCOUNT/juno.git
cd juno
git switch -c docs/juno-nnnn-tenant-invite-rules
```

Read the local setup and documentation standards, architecture overview, and relevant specification before editing. Use the issue forms for bugs, features, integrations, documentation, and architecture. Use [private security reporting](SECURITY.md) for vulnerabilities.

## Implement and submit

1. Keep changes focused. Write English source, identifiers, and technical documentation. Follow [.editorconfig](.editorconfig) and the conventions of the files you change. Document significant decisions in ADRs.
2. Follow the testing standard. Add tests for changes in behavior, including denied authorization and tenant isolation where relevant. Use synthetic data and record actual results.
3. Preserve copyright and license notices. The [MIT License](LICENSE) applies to contributions to Juno software and its associated documentation. Contributors retain rights to their original work. The current contribution policy requires no copyright transfer. Flag uncertain third-party terms for review.
4. Use [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Use an English type and scope, such as `docs(architecture):`, followed by a short imperative description. Example commit message `docs(auth): specify tenant invitation lifecycle`. For breaking changes, use `!` after the type or scope or a `BREAKING CHANGE:` footer and describe migration.
5. Open a pull request against upstream `main`. Link the issue and relevant development task ID when assigned. Summarize impact, assumptions, tests, documentation, security, and meaningful AI assistance and verification. Respond to review and update the description if scope changes.

Use containerized development as the runtime onboarding reference and the visual standard for architecture diagrams.

Use the Git workflow for task branches, atomic commits, draft and ready PRs, and human-controlled merges.

Use the development protocol for owner-requested work and check the definition of done before completion.

Read the [branching and release proposal](docs/governance/release.md), [AI disclosure](AI_DISCLOSURE.md), and [code of conduct](CODE_OF_CONDUCT.md).
