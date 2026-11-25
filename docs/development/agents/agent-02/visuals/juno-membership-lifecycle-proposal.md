# Membership lifecycle concept

**Status:** Concept proposal for JUNO-0028. The implemented directory and detail screens provide read-only membership information. This proposal adds no application code or API behavior.

[Editable Draw.io master](juno-membership-lifecycle-proposal.drawio) · [SVG](juno-membership-lifecycle-proposal.svg) · [PDF](juno-membership-lifecycle-proposal.pdf)

The diagram illustrates a possible sequence from member detail to confirmation and a server-confirmed outcome. It uses a synthetic member. The existing detail layout and design system are the basis for the proposed placement, typography, focus treatment, and status text.

## Proposed interactions

| Situation | Concept | Decision needed |
| --- | --- | --- |
| Active membership | Show a deactivation action on the member detail only when the server confirms the actor may deactivate this target. Describe the effect on access to the organization and retain the detail context after confirmation. | Eligible roles, self-deactivation, scope of session effects, and dependency handling. |
| Inactive membership | Offer reactivation only if the approved transition permits it. Show the role that would apply before confirmation and refresh the status after success. | Eligibility, former role restoration, access to previous allocations, and required audit data. |
| Role modification | Show the current role and the allowed target roles provided by the API. Confirm promotions and demotions with the old and new role in text. | Delegation rules, self-modification, approval requirements and boundaries for assigning administrator. |
| Last active administrator | Explain a confirmed server refusal and keep the detail visible. A previously enabled action can be refused after a concurrent change. | Whether the safeguard applies to every write path, who can appoint a replacement, and the approved conflict response. |
| Membership history | Present an authorized, paginated timeline with change, actor label and localized timestamp. Reuse the current detail page so returning preserves the directory filters. | Retention length, visibility, historical allocations and treatment of former or deleted accounts. |
| Insufficient authority | Omit actions the server does not authorize for the actor and target. Use the existing neutral boundary for denied resource reads. | Capability contract, response semantics and whether restricted reasons are safe to disclose. |

## Accessibility and error handling

Reuse the current member detail identity and status labels. Keep the role and status readable without color. On desktop and narrow layouts, give the confirmation dialog an accessible name and description, move initial focus to Cancel for destructive changes, support Escape, contain focus, and restore focus to the opener or an appropriate detail heading. Present consequence text near the confirmation action. Use English and Brazilian Portuguese messages and preserve the existing theme tokens.

Keep action controls unavailable while a request is pending. Announce success after the API confirms the write. On a stale state, refetch the authoritative detail and explain the approved conflict without claiming a successful change. If a session expires, follow the existing localized sign-in boundary. Keep the history and write policies independent. The API must recheck applicable authority, tenant, target and transition with the write, including the final-administrator invariant if approved.

## Review and release

The [coordination record](../../agent-01/handoffs/juno-organizational-cycle.md) tracks policy decisions. Before implementation, approve an action and actor matrix, policy for prior assignments and history, and the exact API response and validation contract. See the [tenant isolation decision](../../../../architecture/adr/0001-tenant-data-isolation.md).

Juno — Original project creator: Enzo Ribas. Developed with AI assistance. Project license MIT.
