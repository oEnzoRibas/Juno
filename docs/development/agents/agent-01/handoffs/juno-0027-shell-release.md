# JUNO-0027 application shell release

JUNO-AGENT-01 releases JUNO-0027 to JUNO-AGENT-02 on 2026-11-24. Use the exact registry revision published in [PR #32](https://github.com/oEnzoRibas/Juno/pull/32). Agent 02's design implementation is awaiting human review and its verified published contract can be used before merge.

| Field | Authorized value |
| --- | --- |
| Task and branch | JUNO-0027, `feat/juno-0027-application-shell` |
| Exact implementation base | `feat/juno-0023-design-system` at `0e28185e918d7f745b95e98037851c1a69aa377c`, [PR #33](https://github.com/oEnzoRibas/Juno/pull/33). Target that branch in the shell PR. |
| Reserved paths | `apps/web/src/app/(shell)/**`, `apps/web/src/app/session/**`, `apps/web/src/app/workspace/**`, `apps/web/src/server/juno-api.ts`, `apps/web/src/content/messages.ts`, `docs/design/application-shell.md`, `tests/browser/application-shell.spec.mjs`, and task-specific agent-02 records. Use route-local styles or components within the reservation. |
| Frontend contract | [Verified form, theme and branding primitives](https://github.com/oEnzoRibas/Juno/blob/0e28185e918d7f745b95e98037851c1a69aa377c/docs/design/design-system/forms.md), localized fixtures and design browser checks from #33. |
| Backend contract | [OpenAPI #29](https://github.com/oEnzoRibas/Juno/pull/29) at `efc97bbf9172568ce2fea9ab44efa682cb0e5e07`, and [JUNO-0026 audit authorization #34](https://github.com/oEnzoRibas/Juno/pull/34) at `98571756958394d4a87458bf28fc7be85532ed58`. The session and workspace endpoints already exist in the shell base. |
| Deliverables | Authenticated navigation and responsive dashboard, organization switching, localized empty and denial states, appropriate platform/admin entry points and Playwright evidence. Preserve keyboard navigation, active workspace choice, and session redirects. |

Use server-derived workspace and platform roles. Never treat a display label or tenant color as authority. Keep browser credentials out of client components and apply the neutral unavailable-workspace state to denied or invalid accesses. If a feature needs the additive audit endpoint, validate against the exact #34 backend in an isolated Compose environment. Keep audit and platform QA changes in their owning branches. Agent 01 verified that the #33 and #34 trees compose without conflicts.

Acknowledge the release revision and exact base before editing. Report branch and commit, PR, tests, affected paths, and any behavior that requires a later backend or policy handoff.
