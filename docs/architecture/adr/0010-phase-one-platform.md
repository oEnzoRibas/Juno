# ADR-0010 — Phase 1 platform stack and tenant onboarding

**Status:** Accepted technology direction and milestone. Package pins are validated per increment.
**Owner:** Enzo Ribas, in the [implementation authorization](../../development/history/JUNO-0031-request.md).
**Date:** 2026-11-24.
**Tasks:** [JUNO-0017](../../development/tasks/JUNO-0017.md) and [JUNO-0018](../../development/tasks/JUNO-0018.md).

Choose a TypeScript monorepo with independent Next.js and NestJS applications. Use an approved modular monolith, pragmatic domain boundaries, PostgreSQL with database-level isolation, Drizzle, REST and OpenAPI. Use pnpm and Turborepo to run shared tasks. The web uses React, Tailwind CSS, shadcn/ui and next-intl as screens need them. Keep Docker and Compose mandatory. Add Vitest, Playwright and Testcontainers where their tests run. Keep English Markdown, TSDoc, TypeDoc, Docusaurus, Draw.io and ADRs in the documentation direction. Do not scaffold empty apps or add unused packages.

The first vertical workflow starts Compose, provisions a synthetic Junior Enterprise and branding, issues a one-time invitation, activates and authenticates the user, establishes a validated tenant context, checks role permissions, opens the organization dashboard, and denies access to the other synthetic tenant.

An integrated UI/backend or managed provider was considered previously. Independent apps expose a reviewable contract while retaining one business backend and portable self-hosting. Compare package engines and peer dependencies against supported Node 24, record dependency licenses, validate frozen installs and container builds, and keep app secrets outside the web client. Implement RLS with restricted roles and verify transaction-scoped context and cross-tenant denial. Detailed identity and job policy remain separate decisions. ADR-0004's exact outbox implementation and ADR-0007's adapter design are still proposals.

[Next.js setup](https://nextjs.org/docs/app/getting-started/installation) · [NestJS prerequisites](https://docs.nestjs.com/first-steps) · [pnpm installation](https://pnpm.io/installation) · [PostgreSQL row policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
