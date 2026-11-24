# Frontend assignment release

This records the initial release. See the [subsequent JUNO-0027 implementation release](juno-0027-shell-release.md) for the current shell base and reservation.

JUNO-AGENT-01 releases JUNO-0023 to JUNO-AGENT-02 on 2026-11-24. The owner acknowledged registry revision `58af9d4421c71666106e7dba5a039cf8abc8dbae`. JUNO-0035 is complete. [PR #30](https://github.com/oEnzoRibas/Juno/pull/30) merged at `e5a2d8c1936a64d195d49bef927227135d881db2` after editable source, exports and original references were delivered. Keep the published [diagram handoff](https://github.com/oEnzoRibas/Juno/blob/15219bb0f001feb0b370c4d84ec2a31f5c431f83/docs/development/agents/agent-02/handoffs/JUNO-0035.md).

| Field | JUNO-0023, released | JUNO-0027, reserved |
| --- | --- | --- |
| Task branch | `feat/juno-0023-design-system` | `feat/juno-0027-application-shell` |
| Exact base | `feat/juno-0028-tenant-onboarding` at `9f3b01768f297e2113fe198f423d90d983029b69` ([PR #27](https://github.com/oEnzoRibas/Juno/pull/27)) | Inspection base only: `feat/juno-0036-onboarding-openapi` at `efc97bbf9172568ce2fea9ab44efa682cb0e5e07` ([PR #29](https://github.com/oEnzoRibas/Juno/pull/29)). Agent 01 will publish an implementation base containing the verified prerequisites. |
| Reserved paths | `apps/web/src/components/**`, `apps/web/src/app/styles.css`, `apps/web/src/content/messages.ts`, `docs/design/**`, `tests/browser/design-system.spec.mjs`, and task-specific agent-02 records | `apps/web/src/app/(shell)/**`, `apps/web/src/app/session/**`, `apps/web/src/app/workspace/**`, `apps/web/src/server/juno-api.ts`, `tests/browser/application-shell.spec.mjs`, and task-specific agent-02 records. Shell-wide layout or other shared edits require a reservation update. |
| Deliverable | Theme tokens and accessible interactive primitives, tenant accent fallback, EN/pt-BR coverage, keyboard focus, contrast and narrow/zoom behavior with synthetic data. Extend the existing frontend. | Integrate verified design primitives into authenticated layout, navigation, organization switching, dashboard and appropriate settings/admin entry points. Browser coverage should include empty, invalid, denied, dark and localized states. |
| Dependencies | Existing workspace and approved brand. No merge gate for #27, #29 or #31. | The usable JUNO-0023 component/token contract and JUNO-0026 role/audit authorization contract. A verified published revision suffices for each prerequisite. |

The frontend contract is Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5, next-intl 4.16.0, TypeScript 5.9.3 and pnpm 11.25.0. Requests use the existing server-side session boundary. The OpenAPI candidate from #29 specifies opaque bearer sessions, current tenant membership and the neutral 404 for an unavailable workspace. Keep bearer tokens server-side. Design primitives can use fixture data and require no change to the API. Preserve existing English and Brazilian Portuguese translation keys.

Do not edit workspace manifests, the lockfile, Compose, API or SQL files from the design branch. Request a handoff if a design dependency requires shared manifest changes. Confirm the published registry revision, task branch, base and reserved paths before edits. Open the focused PR against the declared dependency and include an exact SHA, validation evidence, limitations and the component/token contract for JUNO-0027.
