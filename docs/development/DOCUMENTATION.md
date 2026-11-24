# Technical documentation standard

Version-controlled Markdown in [docs](../README.md) is the primary documentation source. Keep it readable in a text editor and in a browser without proprietary office software. Write official technical text, identifiers and comments in English. Use relative links, descriptive headings, synthetic examples and explicit status. Update the task and impacted docs in the same change as behavior. Preserve exact commands and versions when reproducibility depends on them.

## What to maintain

| Area | Document with each applicable change |
| --- | --- |
| Product and design | Vision, functional and non-functional requirements, roadmap, design system, accessibility, localization, assumptions and limitations. |
| Architecture and domains | System and module boundaries, business invariants, domain models and events, significant decisions, dependencies and trust boundaries. |
| Data and API | Entity ownership, schema, data dictionary, field semantics and sensitivity, constraints, migrations and recovery. API contracts include scope, versioning, inputs and outputs, errors, abuse controls and retry semantics. |
| Identity and security | Authentication, sessions, recovery, authorization and denial behavior, tenant isolation, audit, credential handling, and threat model changes. |
| Integrations | Configuration, permissions, secret handling, sync, retries, disconnect, failure behavior, provider limits, health, and cost. |
| Delivery and operations | Test and setup commands, deployment, health checks, backups, restore drills, troubleshooting and incident procedures. |
| Community and history | Contribution and governance rules, AI disclosure, changelog, task history, known limitations and technical debt. |

Log deliberate technical debt with impact, owner, revisit trigger, and removal criteria. For requirements, capture actors, inputs, scope, lifecycle, failure behavior and observable acceptance criteria. Give each document an implementation or proposal status when ambiguous. Use the approved [ADR convention](../architecture/adr/README.md) for significant decisions.

## Source code documentation

Document public classes, interfaces, functions, methods, exported types and modules. Cover domain entities, value objects, events, use cases, repositories and integration contracts. Explain complex private logic, invariants, algorithms, security-sensitive behavior, failure modes, side effects and configuration. Document parameters, return values, exceptions, examples and references when they inform use. Explain what the type signature cannot tell a caller. Target meaningful coverage of the public API and business-critical behavior. Omit comments that only repeat the code.

If TypeScript is adopted, prefer TSDoc-compatible comments with TypeDoc reference generation. Use JSDoc in appropriate JavaScript contexts and Doxygen-compatible blocks where the language and tooling support them. Follow the chosen language conventions and define any custom tags deliberately. Inspired by [TSDoc](https://tsdoc.org/), [TypeDoc](https://typedoc.org/), [JSDoc](https://jsdoc.app/), [Doxygen](https://www.doxygen.nl/manual/docblocks.html), the [Google developer documentation style guide](https://developers.google.com/style), and the [Google TypeScript style guide](https://google.github.io/styleguide/tsguide.html).

## Attribution headers

Use a project attribution header in every first-party, human-maintained source file that supports comments. Adapt the syntax and description to the file. Preserve existing copyright and authorship notices. Credit Enzo Ribas as the **original project creator** and reserve file authorship fields for verified authors. For generated or third-party content, preserve its original notices and provenance. For formats without comments, use associated metadata or documentation.

```typescript
/**
 * Resolves organization membership for an authenticated identity.
 *
 * @fileoverview Membership resolution for tenant-scoped requests.
 * @project Juno
 * @remarks Original project creator: Enzo Ribas. Developed with AI assistance.
 * @copyright Copyright (c) 2026 Enzo Ribas
 * @license MIT
 * SPDX-License-Identifier: MIT
 */
```

Use the existing [MIT license](../../LICENSE), [project attribution](../../AUTHORS.md), and [AI disclosure](../../AI_DISCLOSURE.md). The Juno-wide statement is “Juno was created by Enzo Ribas and is developed with the assistance of artificial intelligence.” Keep the SPDX line when supported and configure custom tags only if relevant tools are adopted. Keep legitimate additional copyright lines and avoid ascribing independently authored work to the founder or AI.

## Publishing and diagrams

Use [editable architecture diagrams](../architecture/diagrams/README.md) to show boundaries and workflows with accompanying text. Apply the [visual documentation standard](visual-documentation.md). Keep source in Git, label proposals, and update affected figures with implementation. Evaluate the publishing options in the [technology comparison](../architecture/technology-evaluation.md). Keep generated references reproducible from source.
