---
name: juno-design-system
description: Implement or extend Juno web screens and reusable components using the approved V2 tokens, React primitives, localized navigation and tenant-branding rules.
---

# Implement a Juno V2 interface

Read the [implementation guide](../../../docs/design/design-system-v2-implementation.md) and trace the affected route to its nearest existing component. The [playground](../../../docs/design/style/README.md) is an interaction reference. Check the real route, data contract and server capabilities before exposing an action.

- Build on [shared primitives](../../../apps/web/src/components/ui.tsx) and [semantic tokens](../../../apps/web/src/components/design-tokens.css). Use native links for destinations and buttons for actions. Keep pending controls stable and expose feedback to assistive technology. Retain Nunito for headings and system UI for controls and body text.
- Resolve organization and capabilities through existing server boundaries. Add an authorized destination to the shell's scoped navigation slot. Preserve neutral denial and return URLs across locale switches. Use a validated tenant accent only in its [documented decorative role](../../../docs/design/tenant-branding.md).
- Supply both English and Brazilian Portuguese labels, including accessible names and validation messages. Exercise long names, keyboard focus and both themes. Shell changes must accommodate the mobile drawer and bottom bar, compact tablet rail and wide desktop rail.
- Extend the closest component or browser regression test for the changed behavior. Link the implemented route and exact revision in the handoff. Update the component guide when its public contract changes.
