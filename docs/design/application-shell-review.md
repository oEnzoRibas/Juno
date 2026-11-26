# Application Shell maintainer request for changes

**Task:** [JUNO-0027](../development/tasks/JUNO-0027.md)
**Review:** [PR #37](https://github.com/oEnzoRibas/Juno/pull/37), `feat/juno-0027-application-shell`
**Decision:** Changes requested. Visual design and revised application acceptance are separate and both pending.

The maintainer reviewed the original Shell UAT snapshot `33c3cc6c52e7cffccba982efeaaa6239f507def9` and did not accept its visual and navigation quality. The implementation checkpoint is `a7825a6b814013527414e7478fa77d5b2d3eb60c`. Agent 02 published the editable [design proposal](mockups/juno-shell-redesign-workspace.md) at `a8ecd276fbd80b33171873045c6d0022202c6bb6`. The proposal shows one cohesive visual direction across desktop, mobile and administration. PR #37 stays in draft while the maintainer reviews it.

| View                     | Baseline and proposed evidence                                                                                                                                                                                |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Workspace desktop        | [Original UAT screenshot](../development/agents/agent-02/evidence/shell-review/before-desktop.png) · [Proposed board](../development/agents/agent-02/evidence/shell-review/juno-shell-redesign-workspace.png) |
| Narrow workspace         | [Original UAT screenshot](../development/agents/agent-02/evidence/shell-review/before-mobile.png) · [Proposed board](../development/agents/agent-02/evidence/shell-review/juno-shell-redesign-mobile.png)     |
| Platform and invitations | [Proposed board](../development/agents/agent-02/evidence/shell-review/juno-shell-redesign-administration.png)                                                                                                 |

The proposal is ready for visual review. Implementation screenshots and final functional verification will be added after design approval. Evaluate the persistent authenticated frame, desktop rail collapse, labeled icons and current state, mobile hamburger drawer, organization switcher, route-aware breadcrumbs, explicit parent navigation, dashboard hierarchy and consistent administrative form presentation. A new theme preference or icon dependency shown as an option requires separate scope approval. The current locale, theme and existing product capabilities provide the implementation baseline.

## Ownership within the existing PR

- **Agent 01** owns the review decision, stack and UAT coordination, shared dependencies and contract changes. **Agent 02** owns the shared authenticated shell and its navigation, existing dashboard and session presentation, platform administration layout, onboarding form presentation, shell translation keys, and shell browser coverage. Reserve `apps/web/src/app/(shell)/**`, its session/workspace/platform consumers, relevant presentation in `apps/web/src/app/onboarding/forms.tsx`, `apps/web/src/content/messages.ts` and `tests/browser/application-shell.spec.mjs`. Check actual branch and path state before any changes. Backend authorization, server actions and API behavior stay under their existing ownership.
- Shared layout, dashboard, breadcrumbs, contextual back and presentation consistency belong to #37. Dependent PRs retain their product features and only synchronize route-specific navigation and layout consumers. Preserve filters, cursor and locale on member-detail Back, and preserve authorized visibility of directory and settings links.
- **Agent 03** owns independent QA and new disposable preview validation. Preserve the original Foundation, Shell and Organization UAT worktrees, databases and credentials. After approval and implementation, reserve a new local preview worktree, unique Compose project, new volumes and available loopback ports. Pin main, #37 and only the reviewed dependencies required by the preview. Validate end to end and provide a separate guide and credentials. Record maintainer acceptance of that exact candidate before promotion.

## Dependency checkpoint

[Native stack #50](https://github.com/oEnzoRibas/Juno/stack/50) remains #37 → #43 → #48 → #51. Observed descendant heads are #43 `e5de071650154641b9f08e7c0ba212d5e71def0a`, #48 `145cb9f726cc8d34b2c4c416ef0c08624b6dd562`, and #51 `fcd343c6c94242dfae9fbf78d7a3bcdc242c3087`. The directory, lookup and profile consumers still require #40, #41 and #45 respectively. Existing frontend CI failures related to missing backend ancestry remain visible. After implementation, verify actual remote heads and coordinate shared path changes before syncing each descendant. Validate scoped diffs, original commits and binaries on applicable bases before publication. Re-run hosted tests once the necessary merge ref contains the APIs. All four PRs require explicit acceptance of the revised experience before merging.

## Testing after approval

1. Start from the exact #37 head and follow the repository [Compose validation runbook](../testing/juno-0022-platform-validation.md) on a fresh project with free ports. Run frozen install, lint, types, unit tests, the accepted format gate if present, and the stock Compose browser and SQL checks.
2. Cover platform-only, active workspace administrator, regular member, dual membership, and empty or revoked sessions. Test existing organization creation and invitation workflows, neutral denied/invalid routes and role-specific affordances. Confirm that the shell never substitutes for API authorization.
3. Compare desktop expanded and compact, narrow closed and open drawer at 320 px, light/dark, available languages and zoom. Check keyboard access, tooltip/name availability, focus containment and restoration, Escape, reduced motion, active-route state and deterministic parent links. Check form validation, status announcements and focus. Capture the same synthetic scenarios as the original UAT.
4. Run suite on the reviewed Shell composition and separately with all dependent UI and API heads. Update the #37 description with the actual after screenshots, evidence and revised UAT URL. Maintainer visual approval starts implementation. Explicit acceptance of revised UAT controls merge.

Original project creator: Enzo Ribas. Developed with AI assistance.
