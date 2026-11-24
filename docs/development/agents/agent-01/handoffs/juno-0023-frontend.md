# Frontend baseline transfer

| Field | Value |
| --- | --- |
| Source and destination | JUNO-AGENT-01 → JUNO-AGENT-02 |
| Task | JUNO-0023 and subsequent JUNO-0027 release through the assignment registry |
| Branch, exact revision and PR | `feat/juno-0028-tenant-onboarding`, `e6546726e23f7b0eee36be42b4a8de851c2f29c8`, [PR #27](https://github.com/oEnzoRibas/Juno/pull/27) |
| Changed files | `apps/web/src/app`, `apps/web/src/content/messages.ts`, `apps/web/src/server/juno-api.ts` and onboarding browser tests |
| Contract | Next.js 16.4.6, React 19.3.1, Tailwind 4.3.5, next-intl 4.16.0, TypeScript 5.9.3, pnpm 11.25.0. The existing `apps/web` workspace is the scaffold. |
| API availability | Nest serves `GET /api/openapi.json`. Current [route semantics](https://github.com/oEnzoRibas/Juno/blob/e6546726e23f7b0eee36be42b4a8de851c2f29c8/docs/architecture/tenant-onboarding.md) cover bearer sessions, provisioning, activation, organization listing and tenant access. Server actions keep session credentials server-side. |
| Dependencies and validation | Phase 1 core dependency in #27. Verified Windows checks and two Playwright flows on Linux amd64 Compose. |
| Known limits | shadcn/ui adoption, additional accessible primitives and broader visual review remain. Keep the existing shell and request contract changes through Agent 01. |
| Next action | Finish JUNO-0035 first. When JUNO-0023 is released, extend the existing workspace and verify EN and pt-BR, keyboard, narrow layout and both themes. |
| Acknowledgement | A separate agent records receipt when observed. |
