# JUNO — Integration Hub Visual References and Draw.io Implementation

## 1. Context

The project creator has approved two new visual references for the Juno Integration Hub.

These references establish the intended visual direction for both the integration management interface and its underlying system architecture.

Preserve the previously approved Juno identity, MIT licensing, creator attribution, documentation standards, persistent FIFO development protocol, Docker requirements, and Git contribution workflow.

Register this request in the persistent development queue without interrupting the currently active task.

## 2. Approved reference files

Locate and inspect the following files:

### Integration Hub interface

- docs/design/mockups/juno-integration-hub-ui.pdf
- docs/design/mockups/juno-integration-hub-ui.svg

### Integration Hub architecture

- docs/architecture/diagrams/integrations/juno-integration-hub-architecture.pdf
- docs/architecture/diagrams/integrations/juno-integration-hub-architecture.svg

These files are approved visual references.

Do not unnecessarily redesign, simplify, reorganize, or replace their visual composition.

Reproduce them as faithfully as possible using native Draw.io elements.

## 3. Integration Hub interface mockup

Create the following editable file:

`docs/design/mockups/juno-integration-hub-ui.drawio`

Preserve the approved interface composition:

- Purple integration icon.
- Integration Hub heading.
- Subtitle: "Connect your organization to the tools you already use."
- Integration search field.
- Vertically organized integration catalog.
- Provider icons.
- Provider names.
- Short provider descriptions.
- Connected and Not connected states.
- Green connection status indicators.
- Subtle horizontal separators.
- Rounded containers.
- Clean spacing.
- Modern typography.
- Minimalist visual appearance.

Maintain the same initial provider ordering:

1. GitHub.
2. Slack.
3. Notion.
4. YouTube.
5. Microsoft SharePoint.
6. Discord.
7. Google Drive.
8. Trello.

The displayed connection statuses are illustrative and must not be interpreted as actual integration connections.

Use this mockup as the approved visual reference for the future Integration Hub implementation.

Additional providers may be added to the actual interface without changing its fundamental visual structure.

The implemented interface must eventually support tenant-specific branding, accessibility, responsive layouts, localization, provider search, configuration, and integration lifecycle management.

Do not implement the interface prematurely if its development task is not yet eligible.

## 4. Integration Hub architecture diagram

Create the following editable file:

`docs/architecture/diagrams/integrations/juno-integration-hub-architecture.drawio`

Reproduce the approved architecture composition with the following vertical hierarchy:

### Core platform

- JUNO.
- Core Platform.
- Gamification.
- Learning.
- Reports.

### Integration Hub

- Integration Hub.
- Registry.
- Contracts.
- Adapters.

### Infrastructure and security

- Credentials.
- Permissions.
- Job Queue.

### Optional Integration Providers

Preserve the four-column provider grid:

- GitHub.
- Slack.
- Notion.
- YouTube.
- SharePoint.
- Teams.
- Discord.
- Drive.
- Calendar.
- Forms.
- Trello.
- Outlook.

Preserve the dashed boundary surrounding optional providers.

### Community Extensions

- Community Extensions.
- Future integration adapters.

Maintain the existing visual hierarchy, rounded cards, purple central component, dark platform header, minimal labels, directional connectors, and consistent iconography.

Do not replace this diagram with an unrelated architectural composition.

Document that the architecture represents a proposed technical direction until the corresponding decisions and implementations are validated.

## 5. Native Draw.io requirements

Both diagrams must be created using native, editable Draw.io components.

Every relevant element must remain independently editable:

- Text.
- Titles.
- Icons.
- Provider logos.
- Shapes.
- Containers.
- Connectors.
- Colors.
- Borders.
- Layout.
- Spacing.
- Component groups.

Use readable XML source where supported.

Do not embed the supplied PDF or SVG as a single flattened image inside a Draw.io file.

The provided references must guide the recreation of the diagram rather than replace its editable structure.

Use embedded vector icons or portable, appropriately licensed icon assets.

Avoid external image dependencies that may break rendering.

Use official provider icons where their licensing and brand guidelines permit.

## 6. Visual identity preservation

Use the official Juno palette:

- Primary: #7565F5
- Accent: #A99BFF
- Dark: #10111A
- Light: #F7F7FB
- Success: #22C55E

Accessible semantic color variations are allowed when required for text contrast.

Preserve:

- Rounded component boundaries.
- Minimalist icon-driven composition.
- Clear visual hierarchy.
- Consistent spacing.
- Modern sans-serif typography.
- Professional AWS-inspired architectural visualization.

Do not introduce unrelated colors or visual identities.

## 7. Required deliverables

Maintain the following files:

```text
docs/
├── design/
│   └── mockups/
│       ├── juno-integration-hub-ui.drawio
│       ├── juno-integration-hub-ui.svg
│       ├── juno-integration-hub-ui.pdf
│       └── juno-integration-hub-ui.md
│
└── architecture/
    └── diagrams/
        └── integrations/
            ├── juno-integration-hub-architecture.drawio
            ├── juno-integration-hub-architecture.svg
            ├── juno-integration-hub-architecture.pdf
            └── juno-integration-hub-architecture.md
```

The Draw.io files must become the authoritative editable sources after their visual fidelity has been validated.

Generate synchronized SVG and PDF exports from these sources.

Preserve the original approved reference files until the recreated diagrams have been visually validated.

## 8. Visual validation

Compare the recreated diagrams against the supplied references.

Validate:

- Component placement.
- Alignment.
- Margins.
- Typography.
- Color consistency.
- Icon appearance.
- Text accuracy.
- Connector direction.
- Visual hierarchy.
- Diagram readability.
- Export quality.

Do not claim successful reproduction without inspecting the rendered output.

Document any unavoidable differences.

## 9. Documentation and attribution

All documentation must be written in English.

Preserve the following attribution:

"Juno — Original project creator: Enzo Ribas."

"Developed with AI assistance."

Document:

- Diagram purpose.
- Visual design requirements.
- Source file locations.
- Export instructions.
- Related ADRs.
- Related development tasks.
- Implementation status.
- Third-party icon attribution.
- Known limitations.

Update the design and architecture documentation indexes.

Embed SVG versions using relative repository paths.

## 10. Git workflow

Create separate, focused pull requests for the interface mockup and architectural diagram.

Suggested pull request titles:

- docs(design): establish Integration Hub interface mockup
- docs(architecture): add editable Integration Hub architecture diagram

Suggested atomic commits:

- docs(design): add approved Integration Hub visual reference
- docs(design): recreate Integration Hub mockup in Draw.io
- docs(design): generate mockup vector exports
- docs(architecture): document Integration Hub architecture
- docs(architecture): create editable integration architecture diagram
- docs(architecture): generate integration diagram exports

Use actual task identifiers.

Create task-specific branches, commits, remote branches, and pull requests according to the previously authorized Git protocol.

Do not merge without human approval.

## 11. Permanent visual documentation requirement

Update AGENTS.md to establish these approved references as the visual quality benchmark for future Juno diagrams and interface mockups.

All future visual documentation should follow the same level of clarity, consistency, organization, and professional presentation.

Every significant architectural change must update its corresponding editable Draw.io source and synchronized exports.

Juno documentation must evolve together with its implementation.

Created by Enzo Ribas.

Developed with AI assistance.

Licensed under MIT.

**Juno — Manage. Engage. Evolve.**
