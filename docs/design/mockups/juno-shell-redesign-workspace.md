# Application Shell redesign proposal

**Review status:** Conceptual proposal for maintainer approval in PR #37. The current Application Shell remains the implementation baseline. Task [JUNO-0027](../../development/tasks/JUNO-0027.md).

| Board | Editable source | Exports |
| --- | --- | --- |
| Workspace dashboard and expanded and collapsed sidebar | [Draw.io](juno-shell-redesign-workspace.drawio) | [SVG](juno-shell-redesign-workspace.svg) · [PDF](juno-shell-redesign-workspace.pdf) |
| Platform administration, organization creation and invitation generation | [Draw.io](juno-shell-redesign-administration.drawio) | [SVG](juno-shell-redesign-administration.svg) · [PDF](juno-shell-redesign-administration.pdf) |
| Mobile drawer, organization switcher, account, language and theme | [Draw.io](juno-shell-redesign-mobile.drawio) | [SVG](juno-shell-redesign-mobile.svg) · [PDF](juno-shell-redesign-mobile.pdf) |

## Design for review

Keep the branded rail and global header across authenticated routes. Use a wide content area for the workspace name, current membership and available actions. The illustrations use the Juno design tokens, a restrained tenant accent, and synthetic names. Only server-supported actions appear in the sample dashboard. Members and settings remain conditional on the corresponding dependent feature and tenant authorization.

Use the hamburger to switch between the expanded and icon-only rail on desktop. Persist that desktop preference for the current browser. At narrow widths it opens a dialog-style drawer. Keep the accessible name of each icon, show a tooltip on pointer hover or keyboard focus in the collapsed rail, and return drawer focus to the toggle after close. Escape closes dismissible menus and the drawer. Respect reduced motion. The account area holds language, system/light/dark preference and sign-out. The organization switcher exposes the current and available memberships and their roles.

Keep installation-level provisioning in the Platform context. In an organization, derive actions from the existing server-authorized membership and capability contracts. A platform privilege alone grants no workspace management. Match breadcrumbs to the actual route hierarchy and use explicit Back and Cancel destinations. For dependent member-detail routes, preserve filter, cursor, locale and organization in the return URL.

Place create and invite forms in the same shell. Explain slug and accent formats near the controls, announce validation and server-confirmed outcomes, prevent duplicate submit while the existing operation is pending, and offer the next step only where authorization supports it. The invitation result can copy the private link, with accessible success feedback and a manual copy fallback. The concept deliberately contains no invitation token.

## Implementation and review gates

After visual approval, put incremental functional, tests and evidence commits on the existing PR #37 branch. Keep current PR ancestry. Confirm scope for shared authenticated layouts, platform/onboarding forms and locale messages with Agent 01. Coordinate the preview and regression run with Agent 03. Consider Lucide only after dependency approval. Its [upstream license](https://lucide.dev/license) applies ISC and identifies MIT-licensed Feather-derived icons whose notices must be retained. The mockup icons are editable schematic strokes.

Use the [current shell specimen](juno-application-shell.md) and the existing UAT as the before state. Prepare an isolated preview with its own project and volume, local URL, visible revision, exact PR inputs and synthetic accounts. Keep Foundation, Shell and Organization Management UAT intact. After implementation, compare real desktop and mobile screenshots with this proposal, run the existing checks, and independently validate the dependent frontend stack after coordination.

Juno — Original project creator: Enzo Ribas. Developed with AI assistance. Project license MIT.
