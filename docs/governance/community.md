# GitHub community strategy

Juno is intended for public collaboration. Maintainers should prioritize small, well-scoped contributions, accessible onboarding, transparent decisions, and a useful path from questions to changes. See [contributing](../../CONTRIBUTING.md).

## Where to start

| Need                                                               | Proposed channel                                                                                                                                                               |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Reproducible defect, feature, integration, or documentation change | Use the corresponding [issue form](../../.github/ISSUE_TEMPLATE).                                                                                                              |
| Technical proposal affecting major decisions                       | Start with the architecture issue form. Record accepted decisions in [ADRs](../architecture/adr/README.md).                                                                    |
| Usage question, early idea, show-and-tell, or announcement         | Enable GitHub Discussions when authorized. Start with Q&A, Ideas, Show and Tell, and Announcements. [GitHub Discussions documentation](https://docs.github.com/en/discussions) |
| Security vulnerability or confidential finding                     | Follow [private security reporting](../../SECURITY.md).                                                                                                                        |
| Code or documentation contribution                                 | Describe the change and its validation using the [pull request template](../../.github/pull_request_template.md).                                                              |

For Q&A, ask for the expected outcome, setup, and affected revision. For ideas, ask for the affected role, workflow, and benefit. For Show and Tell, ask for a short description and permission to share any media. For announcements, include the affected versions, dates, and relevant documentation. A discussion that yields actionable work should link to a scoped issue. Maintainers summarize decisions in the relevant issue, specification, or ADR. Moderate public spaces under the [code of conduct](../../CODE_OF_CONDUCT.md) and keep sensitive reports in the appropriate private channel.

## Initial labels

| Label                  | Purpose                                                                               |
| ---------------------- | ------------------------------------------------------------------------------------- |
| `good first issue`     | Small task with clear acceptance criteria, setup hints, and a maintainer contact.     |
| `help wanted`          | Maintainers are seeking a contributor, reviewer, or specialist.                       |
| `beginner-friendly`    | Tasks or guides with a low entry barrier, including work that may span several steps. |
| `documentation`        | Guides, examples, references, or wording.                                             |
| `enhancement`          | A proposed improvement to existing or planned behavior.                               |
| `bug`                  | Incorrect behavior or inaccurate documentation.                                       |
| `security`             | Public hardening work or coordinated follow-up after disclosure.                      |
| `accessibility`        | Inclusive interaction, content, testing, or assistive technology.                     |
| `internationalization` | Locale behavior, translation infrastructure, or language coverage.                    |
| `integration`          | External providers, permissions, or synchronization.                                  |
| `gamification`         | Recognition, challenges, progression, or virtual rewards.                             |
| `architecture`         | System boundaries, technical proposals, or ADRs.                                      |
| `testing`              | Coverage, fixtures, automation, or validation infrastructure.                         |
| `breaking change`      | A compatibility change requiring communication and migration guidance.                |

Maintainers can combine topic and participation labels. Keep labels and Discussions as local proposals until authorized to configure GitHub.

## Recognize contributions

Preserve Git authorship and credit code, documentation, triage, translation, accessibility, and other meaningful work in release notes or contributor documentation with the contributor's preferred name. Consider a future opt-in Contributors Hall of Fame. Evaluate criteria, consent, removal, and maintenance so recognition covers roles that Git metrics may miss. See [authors and contributors](../../AUTHORS.md).
