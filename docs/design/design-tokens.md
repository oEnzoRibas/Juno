# Semantic design tokens

**Status:** The current authentication and onboarding screens consume CSS custom properties in [the shared tokens](../../apps/web/src/components/design-tokens.css). Components consume semantic roles. The [approved palette](color-palette.md) defines the brand references.

| Semantic role          | Light                 | Dark                  |
| ---------------------- | --------------------- | --------------------- |
| `surface`              | `#F7F7FB`             | `#10111A`             |
| `text`                 | `#10111A`             | `#F7F7FB`             |
| `brand`                | `#7565F5`             | `#7565F5`             |
| `accent`               | `#A99BFF`             | `#A99BFF`             |
| `action` / `on-action` | `#5543CF` / `#FFFFFF` | `#A99BFF` / `#10111A` |
| `success-text`         | `#166534`             | `#22C55E`             |
| `focus-ring`           | `#5543CF`             | `#A99BFF`             |

The component styles add separate control borders, hover and pressed colors, inactive controls, feedback surfaces and panel elevation. The browser suite measures the rendered action and feedback text against its surface at 4.5:1 or higher, and focuses and control borders against the panel at 3:1 or higher.

For architecture diagrams, use purple for application, blue `#356BB3` for infrastructure and persistence, teal `#087D77` for security and asynchronous flows, orange `#94491A` for external-integration text, and neutral `#62677D` for operational notes. Use `#5543CF` for small purple labels. Pair color with labels and boundary styles. See the [visual standard](../development/visual-documentation.md).

In the form primitives, spacing uses 8, 12, 16 and 32 px equivalents at the default root size. Controls have an 8 px radius and a 44 px minimum height. Panels have a 16 px radius. The system sans-serif stack keeps this implementation independent of external font requests. See the [form specification](design-system/forms.md) for usage, states and tests.
