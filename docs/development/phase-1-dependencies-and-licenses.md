# Phase 1 runtime dependencies

Package metadata was checked against the public npm registry before installation. The committed pnpm lockfile records the resolved dependency graph and integrity hashes. Juno source is MIT. Preserve upstream notices with distributions.

| Component                                | Workspace pin             | Declared license        |
| ---------------------------------------- | ------------------------- | ----------------------- |
| pnpm and Turbo                           | 11.25.0 and 2.11.13       | MIT                     |
| TypeScript and Node type declarations    | 5.9.3 and 24.10.1         | Apache-2.0 and MIT      |
| Next.js and React/React DOM              | 16.4.6 and 19.3.1         | MIT                     |
| React and React DOM declarations         | 19.3.0                    | MIT                     |
| next-intl                                | 4.16.0                    | MIT                     |
| Tailwind CSS and its PostCSS plugin      | 4.3.5                     | MIT                     |
| PostCSS                                  | 8.5.33                    | MIT                     |
| NestJS core, common and Express adapter  | 12.6.0                    | MIT                     |
| NestJS Swagger                           | 12.1.2                    | MIT                     |
| reflect-metadata and RxJS                | 0.2.2 and 7.8.2           | Apache-2.0              |
| ESLint and typescript-eslint             | 10.15.0 and 8.73.0        | MIT                     |
| Vitest                                   | 5.1.1                     | MIT                     |
| Playwright Test                          | 1.65.1                    | Apache-2.0              |
| Drizzle ORM, pg and pg type declarations | 0.45.4, 8.23.1 and 8.23.1 | Apache-2.0, MIT and MIT |

The supported Node major is 24. Next, Nest, Vitest and the approved future Testcontainers release support that major. TypeScript 5.9 is inside the checked Nest Swagger and typescript-eslint peer ranges. Retain the runtime’s known pnpm major across CI and development. Install shadcn/ui components, Testcontainers, TypeDoc and Docusaurus when their respective increments need them.

The official Node 24 Bookworm Slim and PostgreSQL 17 Bookworm image indexes were checked for Linux amd64 and arm64. The container increment records the selected image digests and the platforms exercised. This workspace has no tenant data or database access.
