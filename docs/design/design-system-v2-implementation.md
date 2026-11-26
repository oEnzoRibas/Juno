# Design System V2 implementation

The [approved interactive baseline](https://github.com/oEnzoRibas/Juno/tree/7e434d664e8ad02963684406efd6932fd11b2663/docs/design/style) guides the production React implementation. [JUNO-0027](../development/tasks/JUNO-0027.md) and [PR #37](https://github.com/oEnzoRibas/Juno/pull/37) track runtime validation and final acceptance. Keep the prototype and [editable boards](design-system-v2.md) available for visual review.

## Foundations

[Semantic tokens](../../apps/web/src/components/design-tokens.css) are the shared CSS source. Tailwind and CSS Modules consume the same roles.

| Role              | Implementation                                                                                                                                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typography        | Locally hosted Nunito variable for display, headings and wordmark. System UI for text, controls and data. The font ships under the [SIL OFL](../../apps/web/public/fonts/OFL.txt).                                        |
| Canvas and panels | `--surface` and `--panel` map to light #F8F5FD and #FFFFFF, dark #181222 and #251C32. `--text`, `--muted`, `--border` and `--control-border` express separate roles.                                                      |
| Actions           | `--action` and `--on-action` map to light #6332BA/#FFFFFF and dark #C9AEFF/#211333. `--action-edge` contributes a 3 px inset depth with no movement or size shift on press. `--focus-ring` uses a dedicated global color. |
| Geometry          | 4/8/12/16/24/32/48 px spacing, 12 px control radius, 14 px panel radius, 44 px baseline target, up to 85 rem workspace content. Sign-in and activation center a narrower form column.                                     |
| State             | Semantic success, warning and danger pairs respond to theme. Disabled controls have readable labels and native disabled behavior. Pending actions stay in place, prevent duplicate submissions and expose `aria-busy`.    |
| Theme             | Light, dark or operating-system scheme. The browser-local preference survives sign-out and route changes. A newly rendered document can initially use the OS theme until hydration restores the browser preference.       |
| Tenant branding   | The existing verified organization accent remains a decorative dashboard border. Authorization, contrast, action colors, text, focus and status colors remain shared. See [tenant branding](tenant-branding.md).          |

## Reusable production components

- [Button, Panel, PageHeading and Notice](../../apps/web/src/components/ui.tsx) provide native semantics. Buttons support primary, secondary, tertiary and destructive variants, with hover, pressed, focused, disabled and busy states. Use the destructive variant only for an approved capability with a clear confirmation. Use native links for navigation.
- [PasswordField and SubmitButton](../../apps/web/src/components/password-field.tsx) keep permanent labels, password-manager autocomplete and the current value during reveal. Use `new-password` for activation and `current-password` for sign-in.
- [PublicAccess](../../apps/web/src/components/public-access.tsx) aligns access forms and localized feedback. The activation language link preserves the browser-only invitation fragment.
- [ApplicationShell](<../../apps/web/src/app/(shell)/_components/application-shell.tsx>) accepts server-verified workspaces and platform state, a scoped `additionalNavigation` slot, a section and optional breadcrumbs. Provide invite capability only when the API confirms it. Membership and account permissions remain server-enforced.
- [ShellIcon](<../../apps/web/src/app/(shell)/_components/shell-icon.tsx>) exposes the existing line icons. The link or button supplies the accessible name. Focus and hover reveal compact rail labels.

```tsx
<Panel aria-labelledby="invite-title">
  <h2 id="invite-title">Invite a member</h2>
  <form action={action}>
    <label className="form-field">Email address <input type="email" name="email" required /></label>
    <Button type="submit" pending={pending}>Create invitation</Button>
  </form>
</Panel>
```

Use translated messages in application code. Associate errors and helper text with their inputs. Use an alert for a rejected action and a status for success. Keep long organization names and addresses wrappable and give focus an unobscured target.

## Responsive navigation

The wide rail expands by default from 1024 CSS px and keeps an explicit browser-local compact preference. At 768–1023 px the rail is compact, so switching between a desktop preference and a constrained tablet does not alter that preference. Below 768 px the application uses labeled bottom navigation and a contextual modal drawer. Available destinations come from the verified account and membership. The bottom bar reserves safe area and content space. Tab, Escape and focus return use native dialog behavior with explicit controls. The account route works at all widths and gathers language, theme and sign-out in one place. Contextual Back returns to the verified workspace, installation or organization selector. The workspace switcher displays role text and remains keyboard-operable in desktop and drawer layouts.

Capture 320, 375, 390, 768, 1024, 1280 and 1920 CSS px. Check the actual bounds of controls and modals, keyboard order, 200% zoom and reflow, visible focus, high contrast, reduced motion, both locales, long content and real tenant denial. Automated checks do not establish WCAG conformance. Validate assistive technology separately.

## Extend and synchronize

1. Start with the nearest shared component, examples and the approved playground. Reuse existing semantic tokens and CSS conventions. Add a token only for a recurring semantic need and verify both themes, focus and tenant treatments.
2. Use the existing server authorization and query boundaries. Scope navigation to returned capabilities, maintain links and labels for both locales, and keep neutral denial intact.
3. Add regression coverage, update the documented component API and attach actual screenshots from the pinned implementation. Preserve authorized production URLs and the historical UAT evidence.
4. Adapt #43, #48 and #51 in stack order after Agent 01 releases the stable V2 pin. #43 brings the capability-gated member navigation and list, #48 adds filters/cursor/detail and context-safe language return, #51 applies form/status styles to settings. Retest each against its previous head and the integrated schema 8 policies. Preserve all existing backend tests and feature history.

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
