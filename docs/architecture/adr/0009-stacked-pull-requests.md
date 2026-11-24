# ADR-0009 — Native stacked pull requests and review readiness

| Field | Value |
| --- | --- |
| Status | Accepted workflow and preferred compatible merge method. |
| Date | 2026-11-24 |
| Decision owner | Enzo Ribas, in the [owner brief](../../development/history/JUNO-0016-request.md) |
| Prepared by | Codex, AI-assisted |
| Task | [JUNO-0016](../../development/tasks/JUNO-0016.md) |

## Decision

Base independent PRs on main. Use a native GitHub stack for genuine dependencies when available. For existing PRs, inspect scope and commit ancestry before attaching native metadata. Use the official extension's PR-URL linking flow where appropriate. Preserve existing PR numbers and branch history. A manual chain is an explicit fallback when native linking or linear ancestry is unavailable.

Local validation and complete documentation make a scoped change ready for review. Open prerequisites restrict merge eligibility while review can start immediately. A draft is appropriate for unfinished work or a non-incremental diff. Proposed technical ADRs may be reviewed as regular PRs. Human approval remains mandatory for every merged layer.

## Alternatives and consequences

Independent branches permit separate review and integration. Genuine dependencies need ordered integration. Manual chains work without native tooling but make duplicate patches and unsafe targeting easier. Native stacks expose layer order and integration controls. Automatic rebases can change SHAs, so inspect and authorize any operation that rewrites published history.

| Merge option | Effect and trade-off |
| --- | --- |
| Merge commit | Preserves atomic commit identities and branch structure. Adds merge commits to main. |
| Rebase and merge | Keeps meaningful changes recognizable and creates linear history. Recreates commit identities and needs downstream validation. |
| Squash and merge | Keeps one summary per PR. Collapses individual commits and changes ancestry. |

The owner selected Rebase and merge as the preferred method when supported by the native stack. It retains atomic changes and creates a linear history. Use another method only with explicit owner approval. No merge is authorized by this decision.

## Validation and enforcement

Use the GitHub stack map, merge base, patch-equivalence checks, three-dot diffs and verified head/base SHAs. Confirm review and CI and reject cycles, missing prerequisites, duplicated patches, and scope drift. An automated check should enforce a bottom-up policy on trusted handlers using immutable refs. Configure required checks or branch protection only with separate owner authorization. Review also guards against merging unaccepted design choices into implementation.

[GitHub stack overview](https://docs.github.com/en/pull-requests/get-started/about-stacked-prs) · [Stack creation](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-stacked-pull-requests) · [Stack merge rules](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-stacked-pull-requests)
