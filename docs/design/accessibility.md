# Accessibility and localization

Target WCAG 2.2 AA in key flows. Use semantic controls, visible focus, logical tab order, labels and error summaries. Announce status changes where needed and pair color with text or meaningful icons. Respect reduced-motion preferences. Preserve navigation and readable content at narrow widths and zoom. Provide captions or an accessible equivalent for learning media. [WCAG 2.2](https://www.w3.org/TR/WCAG22/)

Verify keyboard and screen reader flows, text and control contrast, and responsive reflow across light, dark, and tenant themes. Check translated labels in dialogs, navigation, and dense tables. See the [testing strategy](../testing/README.md).

Build message catalogs for `en` and `pt-BR`. Use locale-aware pluralization, dates and number formatting. Apply an explicitly configured time zone to organization deadlines while allowing users to choose their own display language. Keep code and API identifiers in English and avoid assumptions about national currencies, calendars, organizational structures, or workflows.
