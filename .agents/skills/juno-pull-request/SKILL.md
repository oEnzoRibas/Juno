---
name: juno-pull-request
description: Prepare or audit reproducible Juno PR evidence. Use for exact-head instructions, missing test coverage, runtime provenance or review readiness. Keep branch maintenance and benchmark scoring separate.
license: MIT
metadata:
  version: '1.0.0'
---

# Juno pull request

## Inputs

Use the PR head, base, intended scope, validation requirements and original run receipts. Treat a historical UAT or earlier green job as evidence for its own pin.

## Procedure

1. Read the [maintainer review standard](../../../docs/development/git-workflow.md#maintainer-review-standard). Compare the published head, applicable integration base and incremental files.
2. For executable work, use the commands documented by the exact review launcher. Check the revision, tree, image identity and real web-to-API connectivity. Preserve the separately pinned maintainer UAT. When provenance is absent, record it as unavailable.
3. Match required tests to tests actually executed. For schema-8 review, compare the expected SQL multiset with named execution records, including omissions and duplicates. A fixture on disk or a green process cannot establish coverage. Tie the exit code to the actual command.
4. Update the review evidence with exact refs, actual results, executable positive and negative scenarios, safe teardown, CI links and remaining gates. Keep implementation, independent QA and maintainer acceptance separate.

Output a reviewable evidence record with missing or mismatched checks identified explicitly. Inspect supplied artifacts first. Docker, GitHub access and an authorized isolated review scope are needed only for actual execution or publication. Preserve the observed failure and use the [runtime review runbook](../../../docs/testing/juno-review-runtime.md) for recovery.
