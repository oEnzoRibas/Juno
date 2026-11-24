# Continuous integration validation

**Status:** Implemented in the [runtime workflow](../../../../.github/workflows/runtime.yml) for [JUNO-0022](../../../testing/juno-0022-platform-validation.md).

The workflow runs separate workspace and Compose jobs on GitHub-hosted runners. Workspace checks validate committed whitespace, scan the diff for secrets, install locked dependencies, lint, type-check, build, and run Vitest. The Compose job uses the same isolated onboarding runner as local validation. No deployment or merge runs from this workflow.

[Editable Draw.io master](juno-ci-validation.drawio) · [SVG](juno-ci-validation.svg) · [PDF](juno-ci-validation.pdf)

Uses the approved Juno brand stencils and palette. Juno was created by Enzo Ribas. This diagram was developed with AI assistance.
