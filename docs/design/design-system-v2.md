# Design System V2 proposal

**Status:** Proposed. Formal changes requested on [PR #37](https://github.com/oEnzoRibas/Juno/pull/37). Maintainer approval of this visual direction precedes runtime work. The original proposal, implementation, preview and automated evidence remain historical records. The maintainer did not accept the revised interaction or visual quality.

| Board | Editable source and exports |
| --- | --- |
| Authentication and organization selection on desktop and mobile | [Source, SVG and PDF](mockups/juno-v2-access.md) |
| Expanded and compact sidebar, responsive shell, organization switcher and mobile account | [Source, SVG and PDF](mockups/juno-v2-navigation.md) |
| Platform provisioning, tenant administrator and ordinary member | [Source, SVG and PDF](mockups/juno-v2-administration.md) |
| Workspace switching, desktop preferences and a contextual mobile drawer | [Source, SVG and PDF](mockups/juno-v2-preferences.md) |
| Buttons, fields, semantic states and content containers | [Source, SVG and PDF](mockups/juno-v2-components.md) |

[Reference study and component matrix](design-system-v2-reference.md) · [Current interface audit](../development/agents/agent-02/handoffs/JUNO-0027-v2-audit.md)

## Identity and foundations

Keep the current Juno wordmark. Use the existing purple as the default active and primary colour. Rounded containers, an anchored primary action, visible selected states and concise feedback give Juno a warmer feel while leaving table density and workflow context intact. Use sentence case, plain-language task labels, and original simple line icons. Avoid decorative badges, scores and progress where the data model has no corresponding information.

| Foundation | Proposed tokens or usage |
| --- | --- |
| Typography | Evaluate Nunito 700–800 for H1/H2 and prominent section labels. Use current system UI for body, forms, navigation and tables. Review PT-BR glyphs, 200% resizing, and tabular digits before adoption. Fonts in the Draw.io exports use portable Arial for review. |
| Scale and widths | 4, 8, 12, 16, 24, 32, 48 px. Body 16/24, detail 14/21, H2 24/30, H1 28–36/1.2. Auth column approximately 416 px. Admin form approximately 560 px within a broader canvas. Data tables may use the available width. |
| Outlines and corners | One pixel separating surfaces, two pixels for selected or focus where required, radius 8/12/16 for small controls, fields and cards. Support 44–48 px control height with enough spacing. |
| Light foundation | Background #F6F4FB, surface #FFFFFF, text #211B34, muted #5B526E, separation #DDD6EB, strong control boundary #746A86. Primary #5543CF with white label and #382995 bottom edge. |
| Dark foundation | Background #151323, surface #221D33, text #FAF8FF, muted #CEC5E1, separation #4A405C, strong control boundary #9D90B2. Primary #B8A9FF with #151323 label and #8170D8 bottom edge. |
| Semantic pairs | Success #186043 on #E6F4EB, warning #6B4700 on #FFF1D1, error #8E1C40 on #FCE8EC, information #234A85 on #E8F0FC. Dark counterparts use #9CE6C1/#18372C, #FFD18A/#42321A, #FFB9CA/#481F32 and #B7D4FF/#23324F. Focus uses the global theme focus color. Disabled controls retain readable labels and native state. |
| Feedback | A primary button can use a 3 px anchored bottom edge and a distinct pressed state. Secondary actions use a quiet outline, destructive confirmation uses its semantic pair, pending keeps target size and exposes status. Use immediate state feedback for reduced motion. |

The thin strokes on the boards indicate component shapes. Implementation uses the stronger control-boundary token where the outline is the only visible affordance.

## Navigation and forms

- Desktop at 1024 px and above uses a labeled rail and breadcrumbs. Compact navigation is an explicit, reversible preference. Icon-only items retain accessible names and focus-triggered labels. Keep platform context distinct from a tenant workspace.
- Mobile below 768 px uses three stable destinations (Overview, Organizations, Account) where applicable. Account opens a dedicated full-width route with labeled language and theme rows. On administrative routes, an in-content actions list or scoped drawer carries deeper navigation. Use a short breadcrumb or contextual Back in the page, preserve locale and filters, and reserve bottom inset for any persistent navigation. At 768–1023 px, validate a compact rail or single-column variant before settling the breakpoint. Public authentication stays free of the authenticated navigation.
- A drawer-only mobile design scales more easily to many modules and has fewer fixed elements, but hides frequent destinations. A labeled bottom bar with contextual drill-down keeps discovery cheap while limiting top-level destinations. Avoid a mobile account popover at the narrow breakpoint. Desktop popovers use viewport collision handling and a scrollable panel with preferred focus return.
- Keep credentials on one screen with visible labels. Align fields, validation, and button to the same content column. Use accessible reveal, paste, autofill and password-manager behavior. Organization selection shows real memberships with role in text. If an account has none, show a useful empty state. An operator has an installation entry only when the API confirms it. Workspace links appear only for the active membership and capabilities.
- Preserve semantic native table headers, keyboard-reachable scroll for wide tables, persistent filter context, and labeled pagination. Empty filtered results offer clear filters. Long names wrap or expose the full value in accessible content.

## Tenant branding and contrast

Global typography, spacing, radius, icon conventions, layout and behavior stay fixed. Tenant branding contributes a validated decorative accent today. The existing profile API supports name and a single hex accent. Logo uploads, additional palette entries, media storage, accessible logo text, and tenant theme overrides require their own approved API/storage contract. The mockups show possible tenant treatments without adding those capabilities to the runtime. See [existing tenant branding](tenant-branding.md).

A future palette resolver would normalize sRGB hex, derive distinct light/dark surfaces and interactive states, and measure WCAG relative luminance against each actual background. Require at least 4.5:1 for ordinary text, 3:1 for large text and relevant non-text boundaries and states. Evaluate normal, hover, selected, pressed and focus separately. If a derived tenant pair fails, try an accessible foreground or a small lightness adjustment. When those still fail, use the default Juno interactive pair and retain the tenant color decoratively. Semantic status and global focus colors never inherit arbitrary tenant colors. Validate logos on both surfaces separately when the contract exists.

Prototype pair checks using the WCAG relative luminance formula follow. These are token examples. Actual rendering also needs checks against adjacent surfaces and for interaction states.

| Pair | Colours | Contrast |
| --- | --- | --- |
| Default light action | #FFFFFF on #5543CF | 6.80:1 |
| Default dark action | #151323 on #B8A9FF | 8.84:1 |
| Teal example | #FFFFFF on #176B60 | 6.35:1 |
| Coral example | #151323 on #FFB59C | 10.74:1 |
| Light control boundary | #746A86 on #FFFFFF | 5.06:1 |
| Dark control boundary | #9D90B2 on #221D33 | 5.47:1 |
| Arbitrary yellow accent with white | #FFFFFF on #FFF000 | 1.19:1 |

The yellow example fails white text and illustrates why automatic fallback is required.

## Accessibility and independent QA

Target [WCAG 2.2 AA](https://www.w3.org/TR/WCAG22/), including text/non-text contrast, 200% text resizing, 320 CSS px reflow, keyboard operation, visible and unobscured focus, names/roles/values, labels, errors, status announcements, accessible authentication and minimum targets. Use 44–48 px as the design target. Use native controls first. For modal drawers/dialogs, test initial focus, containment, Escape and return. For navigation, verify current-page announcements and text or icon reinforcement. Check reduced-motion behavior and manually verify screen-reader order in one desktop and one mobile combination.

After approval, Agent 03 independently validates units, server integration and browser workflows, automated accessibility and manual keyboard use, authorized and denied access, and representative screenshots from each exact build. Cover 320/375/390/768/1024/1280/1920 px, 200% text, browser zoom and a 320 CSS px equivalent, EN/PT-BR, long names and emails, themes and contrasting tenant accents. The audit's measured overflow is an explicit regression gate. Test dialogs, menus, zoom and contrast independently of visual acceptance.

## Implementation plan after approval

1. In existing PR #37, define semantic CSS variables above existing tokens and use native React form, button, field, link, navigation and status primitives. Reuse Next.js authenticated route boundaries, server session and capability checks. Keep browser preferences in the UI boundary. Compare grouped routes with a wrapper/slots approach before changing folder layout. Keep a route-stable persistent shell and server-authorized data per page. Audit the existing Tailwind/CSS Modules mix before adding any dependency.
2. Adopt in order: foundation and primitives, public authentication, organization selection, authenticated navigation and dashboard, existing platform provisioning and workspace invitations. Maintain current APIs and URL contracts. Record behavior changes in focused commits and run independent preview QA. Font and tenant additions are separate decisions.
3. With Agent 01, inspect #43, #48 and #51 against the accepted #37 baseline. Coordinate small route/layout and token adoption commits without discarding each feature history or removing tests. Preserve lookup filters/cursors, profile authorization and real runtime APIs. Retest the composed frontend with Agent 03. Wait for reviewed ancestry before publication or merge.
4. Keep original UAT, previous visual proposal and CI history. Log this intervention as a separate design-review event for Juno Research. Archive the reproducible viewport observations with exact artifact provenance. Treat usability judgments as review observations pending user acceptance.

## Decision still requested

Approve the default purple, mobile three-destination navigation plus direct account page, restrained tactile action style and visual hierarchy before implementation. Scope approval remains necessary for a locally hosted Nunito font, for the exact tablet breakpoint, and for future upstream logo/palette contracts. Protected Duolingo views and native runtime interaction remain unverified. The concept previews are not interactive implementations.

Juno — Original project creator: Enzo Ribas. Developed with AI assistance. Project license MIT.
