# Authentication and onboarding form primitives

The first Juno form primitives are applied to the existing sign-in, invitation activation, tenant provisioning, invitation creation and workspace routes. They use native buttons, links, input elements and select elements. The browser provides keyboard and assistive technology behavior, while CSS supplies spacing, appearance and feedback.

| Pattern | Usage | Behavior |
| --- | --- | --- |
| Field | Wrap the visible label and native control in `label.form-field`. | Set the correct type and autocomplete token. Constrain the input within the available width. |
| Primary action | Apply `action-button` to a submit button or a navigation link. | Preserve the control's semantics. Use the native button's `disabled` attribute while submitting where the form exposes pending state. |
| Error | Present the message in a paragraph with `role="alert"` inside the panel. | Announce the change and describe it in text. Preserve the API's generic denial and invalid-invitation responses. |
| Success | Present the message in a paragraph with `role="status"` inside the panel. | Announce confirmation without taking focus from the user. |
| Panel | Use the existing `public-shell` and `public-panel` layout. | Wrap long strings and constrain fields within the panel. Keep the theme consistent between authentication and onboarding. |

The light and dark themes follow the operating system preference. The styles keep focused controls visible in Windows forced-colors mode, and use native browser controls for credentials, role selection and the branding color picker.

The workspace accent is a decorative bar. It uses the validated color already returned by the tenant dashboard endpoint. Text, background, action and focus colors still come from semantic theme tokens. This preserves legibility even when a selected accent is close to the panel color or when switching tenants. Neither a tenant accent nor a user-facing role label controls access.

Current pages continue to use existing English and Brazilian Portuguese catalogs, routes and server actions. Existing accounts accept an invitation with their matching server-side session. New accounts choose a password. See the [onboarding contract](https://github.com/oEnzoRibas/Juno/pull/29) for the request and denial semantics.

## Verify changes

Run the browser scenarios in a disposable Compose project. Bootstrap a synthetic platform administrator and expose its credentials to the test process with `JUNO_TEST_ADMIN_EMAIL` and `JUNO_TEST_ADMIN_PASSWORD`. Use `JUNO_SMOKE_WEB` and `JUNO_SMOKE_API` for non-default ports.

```sh
pnpm exec playwright test tests/browser/design-system.spec.mjs
```

The suite checks the keyboard sequence, focus visibility, control and message contrast, and 320 CSS px reflow. It checks English and Brazilian Portuguese screens and confirms that two synthetic tenant accents stay independent from the action palette in both themes. The normal authentication and onboarding browser tests cover submission and authorization behavior. Follow [accessibility and localization](../accessibility.md) for manual verification.
