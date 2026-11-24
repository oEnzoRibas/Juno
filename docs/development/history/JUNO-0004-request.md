# JUNO — Optional Integration Ecosystem and Editable Architecture Diagrams

## 1. Instruction precedence

This document supplements all previously approved Juno project instructions.

Preserve all existing requirements concerning:

- MIT licensing.
- Original creator attribution to Enzo Ribas.
- AI-assisted development transparency.
- Documentation-first engineering.
- Persistent FIFO development.
- Atomic Git commits.
- Focused pull requests.
- Human-controlled merging.
- Mandatory Docker containerization.
- Multi-tenant architecture.
- Official Juno visual identity.
- Architectural Decision Records.
- Automated testing.
- Community-driven open-source development.

Register the requirements introduced by this document in the persistent development queue.

Do not abandon or interrupt the currently active development task.

Split integration architecture, provider implementations, and visual documentation into separate, logically scoped development tasks and pull requests.

## 2. Integration Hub

Juno must provide a centralized Integration Hub that allows each Junior Enterprise to connect external applications independently.

External integrations must be optional.

No external integration must be required for Juno's core organizational management, gamification, learning, reporting, authentication, or reward management capabilities.

Juno must remain usable as a fully independent, self-hosted platform without external integrations.

Each tenant must be able to configure its own integration ecosystem.

Organizations must be able to enable, disable, connect, disconnect, and configure supported integrations without modifying the application source code.

## 3. Integration catalog

Establish an extensible integration catalog containing the following providers.

### Development and project management

- GitHub.
- GitHub Projects.
- Trello.

### Communication and collaboration

- Slack.
- Microsoft Teams.
- Discord.

### Knowledge and document management

- Notion.
- Microsoft SharePoint.
- Google Drive.

### Learning and development

- YouTube.

### Calendars and organizational activities

- Google Calendar.
- Microsoft Outlook Calendar.

### Forms and participation

- Google Forms.

GitHub, GitHub Projects, YouTube, SharePoint, Slack, and Notion are required integration capabilities in the product roadmap.

Additional providers are proposed expansion candidates.

Do not attempt to implement all providers simultaneously.

Evaluate technical feasibility, authentication requirements, API limitations, provider terms, operational costs, security implications, and user value before implementing each provider.

Clearly distinguish planned providers from functional integrations.

## 4. Optional provider architecture

Evaluate and document an integration architecture based on:

- Ports and Adapters.
- Adapter Pattern.
- Provider Registry.
- Capability-based interfaces.
- Dependency injection.
- Domain events.
- Background job processing.
- Tenant-scoped configuration.

Core business modules must not directly depend on external provider SDKs.

Each provider must be implemented behind an explicit integration contract.

Avoid requiring every provider to implement capabilities it does not support.

Separate capabilities such as:

- Authentication.
- Notification delivery.
- Document discovery.
- Document retrieval.
- Project synchronization.
- Calendar synchronization.
- Contribution tracking.
- Course discovery.
- Form response processing.
- Webhook processing.

Use capability-specific interfaces instead of a single oversized integration interface.

The absence or failure of an integration must not prevent unrelated core functionality from operating.

Record the selected integration architecture through an ADR.

## 5. Proposed backend organization

Evaluate the following module organization:

```text
apps/api/src/modules/integrations/
├── domain/
│   ├── entities/
│   ├── events/
│   ├── contracts/
│   └── value-objects/
├── application/
│   ├── use-cases/
│   ├── services/
│   └── registry/
├── infrastructure/
│   ├── providers/
│   │   ├── github/
│   │   ├── github-projects/
│   │   ├── slack/
│   │   ├── notion/
│   │   ├── youtube/
│   │   ├── sharepoint/
│   │   ├── microsoft-teams/
│   │   ├── discord/
│   │   ├── google-drive/
│   │   ├── google-calendar/
│   │   ├── google-forms/
│   │   ├── trello/
│   │   └── outlook/
│   ├── credentials/
│   ├── persistence/
│   └── webhooks/
├── presentation/
├── tests/
└── README.md
```

This structure is a proposal and must be reconciled with existing accepted architectural decisions.

Do not create empty provider directories merely to represent planned integrations.

Implement providers incrementally according to the development queue.

## 6. Provider registry

The Integration Hub must maintain a registry of supported providers.

Each provider should expose appropriate metadata, including:

- Unique provider identifier.
- Display name.
- Description.
- Category.
- Supported capabilities.
- Authentication requirements.
- Required permissions.
- Configuration schema.
- Documentation reference.
- Implementation status.
- Health-check capabilities.

Differentiate provider availability from tenant-specific connection status.

A provider may be available in Juno without being connected to a particular organization.

Planned or experimental providers must be clearly identified in the interface.

Do not present a provider as operational when its implementation is incomplete.

## 7. Tenant-specific integration management

Each organization must have independent integration configurations.

Tenant administrators must be able to:

- Browse available integrations.
- Connect supported applications.
- Configure provider settings.
- Select authorized resources.
- Configure synchronization behavior.
- Configure notification destinations.
- Review granted permissions.
- Review connection status.
- Review synchronization history.
- Review errors.
- Reconnect expired integrations.
- Disable integrations.
- Disconnect providers.

Support multiple connections to the same provider when justified by business requirements.

Never share integration credentials across tenants.

One organization's integration configuration must not affect another organization.

## 8. Integration lifecycle

Define and document integration lifecycle states.

Potential states include:

- NOT_CONNECTED
- CONNECTING
- CONNECTED
- DISABLED
- DEGRADED
- ERROR
- REAUTHORIZATION_REQUIRED
- DISCONNECTED

Document valid state transitions.

Distinguish disabling an integration from revoking its credentials.

Define how synchronized information is retained or removed after disconnection.

Do not silently delete historical reports, rewards, or organizational records when an integration is disconnected.

Document data retention and privacy implications.

## 9. Slack integration

Evaluate an optional Slack application integration.

Potential capabilities:

- Achievement notifications.
- Challenge announcements.
- Report reminders.
- Course completion notifications.
- Reward redemption notifications.
- Organizational announcements.
- Configurable channel destinations.
- Integration health monitoring.

Evaluate OAuth-based authorization and supported Slack APIs.

Use minimum necessary permissions.

Do not read private conversations or collect message content unnecessarily.

Avoid invasive communication monitoring.

Slack must not be required for internal Juno notifications.

## 10. Notion integration

Evaluate an optional Notion integration.

Potential capabilities:

- Authorized page discovery.
- Knowledge base references.
- Organizational documentation.
- Database references.
- Course material references.
- Project documentation.
- Configurable document collections.

Respect Notion workspace permissions and explicitly authorized resources.

Do not expose pages to Juno members who are not authorized to access them.

Prefer secure document references over unnecessary duplication of external content.

Document synchronization limitations and permission behavior.

## 11. Communication providers

Evaluate Slack, Microsoft Teams, and Discord behind compatible notification delivery contracts where their capabilities overlap.

Juno business modules must emit internal events rather than directly sending messages through provider APIs.

Potential notification events include:

- ChallengePublished.
- ChallengeCompleted.
- AchievementUnlocked.
- ExperienceAwarded.
- RewardRedeemed.
- ReportSubmitted.
- ReportApproved.
- CourseCompleted.
- MemberJoined.

Organizations must be able to select which events trigger external notifications.

Allow configurable notification destinations and delivery preferences.

Prevent duplicate notifications, excessive notification frequency, and accidental exposure of sensitive member information.

Failed external notifications must not roll back successfully completed core business operations.

## 12. Document providers

Evaluate Notion, Microsoft SharePoint, and Google Drive through appropriate document provider contracts.

Support authorized document discovery and references where technically feasible.

Maintain the distinction between:

- External document references.
- Synchronized metadata.
- Cached content.
- Locally uploaded documents.

Do not assume that every provider supports identical permission or synchronization behavior.

Respect the original provider's access control model.

Do not use privileged integration credentials to expose private documents to unauthorized Juno users.

## 13. Project and development providers

GitHub, GitHub Projects, and potential additional project management providers must integrate through explicit capability contracts.

Juno must not replace the external tools used for task execution.

Collect authorized information for:

- Reports.
- Contribution tracking.
- Organizational insights.
- Gamification.
- Project references.

Do not equate raw commit counts, message counts, or task counts with individual productivity.

Document the meaning and limitations of every imported metric.

Support non-technical Junior Enterprises that do not use GitHub.

## 14. Learning and activity providers

Evaluate YouTube, Google Forms, Google Calendar, and Microsoft Outlook Calendar for relevant organizational workflows.

Potential capabilities include:

- Course playlist references.
- Training materials.
- Event discovery.
- Calendar synchronization.
- Activity registration.
- Form response validation.
- Challenge participation.

Do not assume that every provider exposes reliable completion or participation information.

Externally collected activity must remain subject to appropriate validation before granting gamification rewards.

Provide manual alternatives when integrations are unavailable.

## 15. Integration security

Every integration must follow security-by-design principles.

Evaluate and document:

- OAuth authorization flows.
- Authorization state validation.
- PKCE where applicable.
- Token expiration.
- Refresh token handling.
- Credential revocation.
- Encryption at rest.
- Secret management.
- Permission scopes.
- Tenant isolation.
- Webhook authentication.
- Replay protection.
- Request validation.
- Rate limiting.
- Audit logging.
- Data retention.
- Account disconnection.

Never expose external provider credentials to the frontend.

Never commit real integration credentials.

Never log access tokens, refresh tokens, authorization codes, or sensitive provider responses.

Ensure integration workers receive and validate tenant context.

Do not allow integration failures to bypass authorization boundaries.

## 16. Reliable synchronization

External integration processing must evaluate:

- Persistent background jobs.
- Retry policies.
- Exponential backoff.
- Provider rate limits.
- Idempotency.
- Event deduplication.
- Synchronization checkpoints.
- Timeout handling.
- Failed job recovery.
- Circuit breaking where justified.
- Incremental synchronization.
- Webhook processing.
- Auditability.

Reuse the existing background job architecture.

Do not introduce a separate message broker for every provider.

Use the approved Docker architecture.

Provider failures must be isolated from unrelated providers and core Juno functionality.

## 17. Integration administration interface

Create a product specification for an Integration Hub within organization administration.

The proposed navigation is:

Organization Settings → Integrations

The interface should provide:

- Integration catalog.
- Provider icons.
- Search.
- Category filters.
- Connection status.
- Configuration forms.
- Permission explanations.
- Connect and disconnect actions.
- Synchronization settings.
- Connection health.
- Error history.
- Links to provider documentation.

Use the approved Juno design system.

Respect tenant-specific branding.

Ensure the interface remains accessible in light and dark themes.

Clearly differentiate operational, experimental, and planned integrations.

## 18. Community integration development

Juno must encourage community contributions introducing new integration providers.

Create a comprehensive integration developer guide.

The guide must explain:

- Integration architecture.
- Provider contracts.
- Capability interfaces.
- Provider registration.
- Authentication strategies.
- Configuration validation.
- Tenant isolation.
- Error handling.
- Background jobs.
- Webhook processing.
- Testing.
- Documentation requirements.
- Security requirements.
- Contribution workflow.

Provide a functional example adapter when the integration foundation is implemented.

Do not introduce arbitrary runtime execution of untrusted third-party plugins.

Community integrations must initially follow the normal reviewed source code contribution process.

Evaluate a more advanced plugin ecosystem only when justified through an ADR.

## 19. Architecture diagram revision

Review all existing architecture diagrams provided by the project creator.

The existing visual references are:

- juno-architecture-overview.
- juno-multi-tenant-isolation.
- juno-gamification-event-flow.
- juno-development-fifo-queue.
- juno-platform-workspaces.
- juno-containerized-development.

Recreate these diagrams using native, editable Draw.io elements.

Preserve the existing Juno visual identity and overall visual direction.

Update diagrams affected by the expanded integration ecosystem.

Do not unnecessarily modify diagrams that are unaffected by the new requirements.

Do not modify the official Juno logo.

## 20. Draw.io as the authoritative diagram source

Use draw.io / diagrams.net as the primary editable architecture diagram format.

Every architecture diagram must have a native `.drawio` source file.

The source must contain individually editable:

- Nodes.
- Technology icons.
- Labels.
- Connectors.
- Arrows.
- Groups.
- System boundaries.
- Infrastructure boundaries.
- Security boundaries.

Prefer readable, uncompressed XML where supported.

Do not generate a Draw.io file containing only an embedded screenshot or flattened image.

A contributor must be able to open the source file and independently modify its elements.

Keep all necessary assets available through portable embedded resources or documented reproducible dependencies.

Avoid external image URLs that could break diagram rendering.

## 21. Mandatory diagram formats

Maintain the following files for every significant diagram:

- diagram-name.drawio
- diagram-name.svg
- diagram-name.pdf
- diagram-name.md

The `.drawio` file is the authoritative editable source.

The `.svg` file is the preferred documentation export.

The `.pdf` file is the preferred standalone distribution format.

The `.md` file provides explanations, implementation status, references, and architectural context.

Optional PNG exports may be provided when necessary.

Keep all exports synchronized with the editable source.

Never manually modify generated exports without updating their authoritative source.

## 22. Diagram visual identity

All diagrams must follow a consistent, professional, icon-driven visual language inspired by AWS architecture diagrams.

This visual direction does not imply AWS deployment or infrastructure dependencies.

Preserve the approved Juno palette:

- Primary: #7565F5.
- Accent: #A99BFF.
- Dark: #10111A.
- Light: #F7F7FB.
- Success: #22C55E.

Use additional semantic colors consistently when needed.

Prefer:

- Recognizable technology icons.
- Minimal text.
- One-to-three-word component labels.
- Orthogonal connectors.
- Directional arrows.
- Consistent spacing.
- Consistent icon sizes.
- Logical grouping.
- Subtle backgrounds.
- Dashed architectural boundaries.
- Clean landscape layouts.
- Accessible color contrast.
- Clear visual hierarchy.

Avoid:

- Paragraphs inside diagrams.
- Excessive text.
- Overlapping arrows.
- Decorative illustrations.
- Unnecessary colors.
- Excessively small labels.
- Dense component layouts.
- Misleading infrastructure symbols.

Use official provider icons where their brand and licensing terms permit.

Document third-party asset attribution.

## 23. Diagram organization

Organize architecture diagrams by domain.

Evaluate the following directory structure:

```text
docs/architecture/diagrams/
├── README.md
├── system/
├── tenancy/
├── gamification/
├── integrations/
├── infrastructure/
├── security/
├── database/
├── development/
└── deployment/
```

Every directory must have a meaningful purpose.

Preserve existing filenames where practical.

When moving existing diagrams, update all related documentation links.

Do not create duplicate copies of diagrams in multiple directories without a justified reason.

## 24. Required integration diagrams

Create the following new visual references as their corresponding architectural tasks become eligible:

### Integration ecosystem

Filename:

`juno-integration-ecosystem`

Show Juno, the Integration Hub, optional provider categories, external applications, and community integration adapters.

### Integration adapter architecture

Filename:

`juno-integration-adapter-architecture`

Show business domains, integration contracts, provider registry, capability interfaces, and external provider adapters.

### Tenant integration isolation

Filename:

`juno-tenant-integration-isolation`

Show multiple organizations with independent provider configurations, credentials, permissions, and synchronization jobs.

### Integration authorization flow

Filename:

`juno-integration-authorization-flow`

Show the authorized connection process between the organization administrator, Juno, and external providers.

### Integration synchronization flow

Filename:

`juno-integration-synchronization-flow`

Show provider APIs, webhooks, validation, persistent jobs, normalized events, and relevant domain modules.

### Integration notification flow

Filename:

`juno-integration-notification-flow`

Show internal domain events, tenant notification preferences, asynchronous delivery, and optional communication providers.

### Integration security boundaries

Filename:

`juno-integration-security-boundaries`

Show tenant context, protected credentials, authorized provider access, background processing, and audit boundaries.

Each diagram must remain visually concise.

Move detailed explanations into accompanying Markdown documentation.

## 25. Update existing system diagrams

Update the system architecture overview to include the Integration Hub as a dedicated modular component.

Show optional external connections to the relevant providers.

Update the gamification diagram to distinguish:

- Internal activity events.
- Optional externally sourced contribution events.
- Tenant-specific scoring rules.
- Reward processing.
- Optional external notifications.

Update the multi-tenant diagram to show independent integration credentials and configurations.

Update the Docker topology only when the integration architecture introduces actual infrastructure requirements.

Do not represent external SaaS providers as local Docker containers.

Preserve the modular monolith architecture unless changed through an accepted ADR.

## 26. Diagram attribution and traceability

Every significant architecture diagram must document:

- Diagram title.
- Purpose.
- Scope.
- Architectural status.
- Related ADRs.
- Related development tasks.
- Author or preparer.
- Last meaningful update.
- Known limitations.

Preserve the following attribution:

"Juno — Original project creator: Enzo Ribas."

"Developed with AI assistance."

Preserve legitimate contributor and third-party attribution.

Do not falsely attribute independently created diagrams to Enzo Ribas.

Keep visible diagram attribution discreet and professional.

Clearly distinguish proposed architecture from implemented architecture.

## 27. Diagram export automation

Evaluate reproducible Draw.io export automation.

Create a documented structure such as:

```text
scripts/diagrams/
├── export-diagrams.sh
└── README.md
```

Provide a cross-platform execution mechanism where practical.

Evaluate a dedicated optional Docker-based documentation tooling environment.

The export workflow should:

- Discover editable Draw.io source files.
- Validate their structure.
- Export SVG files.
- Export PDF files.
- Preserve filenames.
- Preserve directory organization.
- Report export failures.
- Detect missing exports.
- Document required tooling and versions.

Do not include diagram tooling in production application containers.

Do not require contributors to manually install graphical applications merely to build Juno.

When export tooling is unavailable, preserve the editable source and report the limitation.

Never claim successful export generation without executing and validating the export process.

## 28. Documentation integration

Create or update documentation covering:

- Integration Hub architecture.
- Provider registry.
- Capability interfaces.
- Provider development.
- Tenant integration configuration.
- Integration authentication.
- Credential storage.
- Synchronization.
- Notification delivery.
- Security.
- Testing.
- Troubleshooting.
- Community contribution guidelines.

Suggested structure:

```text
docs/integrations/
├── README.md
├── integration-architecture.md
├── provider-registry.md
├── provider-development-guide.md
├── authentication.md
├── security.md
├── synchronization.md
└── providers/
```

Only create provider-specific implementation guides when meaningful information is available.

Maintain a clear roadmap of planned providers.

All documentation must be written in English.

## 29. Architectural Decision Records

Create or update ADRs for significant decisions, including:

- Optional integration ecosystem.
- Integration Hub architecture.
- Provider registry and capability interfaces.
- Tenant-scoped integration credentials.
- External authentication strategy.
- Asynchronous integration processing.
- Integration failure isolation.
- Draw.io editable diagram standard.
- Reproducible diagram export tooling.

Use existing ADR numbering.

Do not create duplicate or contradictory decisions.

Clearly distinguish approved product requirements from proposed implementation strategies.

## 30. Git and pull request organization

Follow the permanent Juno Git and Contribution Protocol.

Separate the work into focused pull requests.

Suggested scopes:

1. Integration product requirements.
2. Integration architecture and ADRs.
3. Provider registry and shared contracts.
4. Integration Hub administration interface.
5. GitHub integration.
6. Slack integration.
7. Notion integration.
8. Additional individual provider integrations.
9. Updated architectural diagrams.
10. Diagram export automation.
11. Integration developer documentation.

The exact boundaries must respect implementation dependencies.

Each provider should generally have its own development task and pull request.

Do not combine unrelated provider implementations into one large pull request.

Include related provider tests, security controls, and documentation within the appropriate provider scope.

Use Conventional Commits.

Create atomic commits, push authorized branches, and open focused pull requests according to existing authorization.

Never merge without human approval.

## 31. Permanent AGENTS.md requirements

Update AGENTS.md to enforce:

- Optional external integrations.
- Tenant-specific integration configuration.
- Integration adapter boundaries.
- Provider capability contracts.
- Secure credential management.
- Integration failure isolation.
- Accurate provider implementation status.
- Community integration extensibility.
- Editable Draw.io sources.
- Synchronized SVG and PDF exports.
- Architectural diagram traceability.
- Official Juno visual identity.
- Focused Git commits and pull requests.
- Complete technical documentation.

Every future provider implementation must update its relevant documentation and diagrams.

Every meaningful architectural change must update affected editable diagram sources and exports.

## 32. Immediate assignment

Register this request in the persistent development queue.

Inspect the current repository and reconcile these requirements with existing architecture, product documentation, and open pull requests.

Preserve the active task.

When the new tasks become eligible:

1. Update the integration product specification.
2. Evaluate the proposed provider architecture.
3. Update the integration roadmap.
4. Create or update relevant ADRs.
5. Inventory existing visual documentation.
6. Recreate existing diagrams as native editable Draw.io sources.
7. Update diagrams affected by the integration ecosystem.
8. Create the new integration architecture diagrams.
9. Generate and validate SVG and PDF exports.
10. Establish reproducible diagram export tooling.
11. Update architecture and integration documentation indexes.
12. Update AGENTS.md.
13. Create focused commits and pull requests.
14. Update the development queue and worklog.

Do not implement all integrations simultaneously.

Do not redesign the approved brand identity.

Do not interrupt existing development tasks.

Do not fabricate completed operations.

## 33. Final execution report

At the end of each execution session, report and persist:

- Task identifiers.
- Task statuses.
- Created files.
- Modified files.
- Architecture decisions.
- Integration requirements.
- Implemented and planned providers.
- Editable Draw.io sources.
- Generated SVG exports.
- Generated PDF exports.
- Export validation results.
- Automated test results.
- Actual commit hashes.
- Actual pull request URLs.
- Known limitations.
- Blockers.
- Remaining work.
- Next eligible development task.

Juno must remain independent, modular, secure, accessible, reproducible, extensible, and community-driven.

Created by Enzo Ribas.

Developed with AI assistance.

Licensed under MIT.

**Juno — Manage. Engage. Evolve.**
