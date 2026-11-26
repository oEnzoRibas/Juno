# Juno Design System V2 Playground

**Status** — The maintainer approved this interactive visual baseline in [PR #37](https://github.com/oEnzoRibas/Juno/pull/37) at [revision 7e434d664e8ad02963684406efd6932fd11b2663](https://github.com/oEnzoRibas/Juno/tree/7e434d664e8ad02963684406efd6932fd11b2663/docs/design/style). This preview uses synthetic data and runs locally in the browser. It does not connect to Juno services, authenticate anyone, send invitations, provision organizations, or change permissions.

## Start the preview

From the repository root, check out the exact review commit linked in PR #37 and run:

```sh
git rev-parse HEAD
python -m http.server 3304 --bind 127.0.0.1 --directory docs/design/style
```

Open [http://127.0.0.1:3304/](http://127.0.0.1:3304/). The preview needs Python 3 and a modern browser. It uses a distinct loopback port from the application and UAT environments. The source is plain HTML, CSS, and JavaScript with a locally bundled font.

## Review the proposal

Open **Playground options** (Portuguese **Opções do playground**) to switch the preview settings. Press Escape or click outside to dismiss the menu. Choosing a screen closes it and moves focus to the screen heading.

| In Playground options  | Try inside the preview                                                                                                                                                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Screen                 | Sign in using an address such as `demo@example.invalid` and any synthetic password, choose an organization, or jump to the dashboard, members, account, platform administration, or component library.                   |
| Viewport               | Compare the expanded and compact rails, then select 390 or 320 px for bottom navigation and the workspace drawer. The preview width is capped by available window space. Resize the browser for actual viewport testing. |
| Language and theme     | Compare English and Brazilian Portuguese in light and dark. Account preferences provide the same interaction in the screen composition.                                                                                  |
| Palette and typography | Compare Juno purple, teal, and coral with Nunito or the existing system font. Switch organizations to see a different membership role and palette.                                                                       |
| Component library      | Compare action hierarchy and hover, press, focus, disabled, and loading states. Try native selects, password reveal, checks, radios, dialog, popover, and empty, loading, success, and error feedback.                   |

Members demonstrates filtering and detail navigation. Platform administration demonstrates local form validation and a simulated submission. The destructive button is a component example in the library. Organization roles only alter which demo controls are shown. The preview uses fixed palette pairs for action and neutral tokens while status colors stay semantic. Production adoption requires independent validation of accessibility, responsive behavior, and server-side authorization followed by final maintainer acceptance.

Nunito is bundled for visual comparison under the [SIL Open Font License 1.1](fonts/OFL.txt). The variable font and license were obtained from the [Google Fonts repository at the pinned source commit](https://github.com/google/fonts/tree/8b0a1d0f5983c89bc2b93f1b5fb55f9e252744b5/ofl/nunito). Nunito's inclusion here is a prototype decision.

## Browser validation

Start the server above. With the repository's locked development dependencies installed and Chrome available, run:

```sh
node tests/browser/juno-v2-playground.mjs
```

Set `JUNO_PLAYGROUND_EVIDENCE` to a directory path to regenerate the images and JSON. The check covers role-aware navigation in the simulation, validation and focus, component states, language, theme, font, keyboard dismissal and focus return, drawer positioning, and popover containment and horizontal reflow at 320, 375, 390, 768, 1024, 1280, and 1920 CSS px. It checks for page errors and external requests. It is not an assistive-technology audit or production authorization test.

- [Members, Portuguese, light, Juno purple, Nunito](evidence/desktop-members.png)
- [Platform administration, Portuguese, light, coral, Nunito](evidence/desktop-platform.png)
- [Component library, English, dark, teal, system UI](evidence/desktop-components.png)
- [Mobile account at 390 px, English, dark, teal, system UI](evidence/mobile-account.png)
- [Mobile options menu at 390 px](evidence/mobile-options.png)
- [Playwright measurements](evidence/validation.json)
- [Maintainer-supplied visual references](references/README.md)
- [Reference investigation](../design-system-v2-reference.md#published-product-evidence)
- [Editable concept boards, SVG and PDF exports](../design-system-v2.md)

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
