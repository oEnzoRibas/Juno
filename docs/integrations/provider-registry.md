# Provider registry and rollout

**Status:** Proposed registry. All catalog entries are planned. Operational status requires implementation, testing, documented constraints, and review.

A registry entry identifies the provider ID, label and description, category, supported capability versions, authorization approach and permissions, configuration schema, documentation, availability and supported health probes. Validate configuration against the adapter schema. Keep global availability separate from each tenant's connection status and health. Only known registry options can appear as executable capabilities.

| Category                 | Roadmap-required optional providers | Proposed expansion                          |
| ------------------------ | ----------------------------------- | ------------------------------------------- |
| Development and projects | GitHub, GitHub Projects             | Trello                                      |
| Communication            | Slack                               | Microsoft Teams, Discord                    |
| Knowledge and documents  | Microsoft SharePoint, Notion        | Google Drive                                |
| Learning                 | YouTube                             |                                             |
| Calendar and activities  |                                     | Google Calendar, Microsoft Outlook Calendar |
| Forms and participation  |                                     | Google Forms                                |

First establish the Hub, local alternatives and capability test harness. Implement each required provider in its own task after review. Start with authorized GitHub contributions and Projects, then prioritize YouTube, SharePoint, Slack and Notion against community value and prerequisites. Record any FIFO changes. Review provider terms, permissions, limits, costs, operational support, security and fallback before accepting each adapter. Expansion candidates may remain unimplemented.

See [provider development](provider-development-guide.md), [administration UX](../product/integration-hub.md), and [provider notes](README.md).
