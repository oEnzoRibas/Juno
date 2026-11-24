# Semantic design tokens

**Status:** The Compose starter uses the light and dark values below for the [approved palette](color-palette.md). Define CSS custom properties or an equivalent theme mechanism at the application boundary. Components consume roles such as `action` and `on-action`; tenant configuration supplies validated values through the same contract.

| Semantic role | Light | Dark |
| --- | --- | --- |
| `surface` | `#F7F7FB` | `#10111A` |
| `text` | `#10111A` | `#F7F7FB` |
| `brand` | `#7565F5` | `#7565F5` |
| `accent` | `#A99BFF` | `#A99BFF` |
| `action` / `on-action` | `#5543CF` / `#FFFFFF` | `#A99BFF` / `#10111A` |
| `success-text` | `#166534` | `#22C55E` |
| `focus-ring` | `#5543CF` | `#A99BFF` |

The action pairs give approximate contrast of 6.80:1 and 7.89:1. Check borders, status, focus, disabled and interactive states in context. Add warning, error, muted and elevated-surface roles as needed with documented contrast checks.

For architecture diagrams, use purple for application, blue `#356BB3` for infrastructure and persistence, teal `#087D77` for security and asynchronous flows, orange `#94491A` for external-integration text, and neutral `#62677D` for operational notes. Use `#5543CF` for small purple labels. Pair color with labels and boundary styles. See the [visual standard](../development/visual-documentation.md).

Start with spacing equivalents of 4, 8, 12, 16, 24, and 32 px and radius candidates of 6 and 12 px. Use borders for surface separation and restrained elevation for overlays. Define default, hover, focus, active, disabled, loading, empty, error, and success states where applicable. Use a consistent icon family with accessible names or labels for actions.
