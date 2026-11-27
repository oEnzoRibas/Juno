# Directorate product route

JUNO-0028, FR-01, issue #89. Product worker base is `550bab236d069689c6894c490bf698e945d57749`. The pilot coordinator integrates this local commit with the organization API and Platform fixtures.

The server-rendered `/workspace/[id]/directorates` page uses the V2 authenticated shell. Every active organization member can read its directorates. The server-verified membership controls the creation form. The server action rechecks that membership before POST. The API enforces final tenant authorization and name uniqueness. Responses use the existing no-store server API adapter and HTTP-only session cookie.

GET `/api/tenants/:id/directorates?after=<UUID>` supplies `{items: [{id, name}], nextCursor}`. The page follows the API cursor and offers a first-page link. English and Brazilian Portuguese navigation, feedback and Account return paths preserve the current cursor. An invalid page link gets localized feedback and a first-page link. An expired session redirects to sign-in in the current locale. Inaccessible tenants use the existing 404 flow.

POST accepts `{name}`. The action trims the display value, validates 1–120 Unicode code points and rejects controls and unpaired surrogate code units. The native input allows up to 240 UTF-16 units to accommodate 120 supplementary characters. The API remains responsible for case-insensitive uniqueness, concurrent writes and audit. A 201 response revalidates the list and clears the input. A 400 or 409 leaves the input available for correction. A network failure, 503 or unexpected status displays safe localized feedback. Pending submission disables the input and submit control. Status and error feedback use the shared live-region Notice primitive.

## Local validation

From the repository root run `pnpm format:check`, `pnpm lint`, `pnpm --filter @juno/web typecheck`, `pnpm test` and `pnpm --filter @juno/web build`. The 11 route unit tests mock the HTTP boundary and cover payload spelling, Unicode boundaries, authorization rechecks, status mapping, cursor validation and locale preservation. The original failed Unicode fixture exposed native FormData replacement of unpaired surrogates. The corrected test explicitly injects the malformed value at the action guard.

## Combined-candidate review

Platform owns the real API/browser fixtures. On the combined candidate, authenticate an active member and administrator of the synthetic organization. Open the route and use the shell link at desktop and 320/390 px drawer sizes. Verify keyboard focus, wrapping of long names, both locales and light/dark V2 surfaces. Create a directorate as the administrator, confirm success, then submit the same normalized name and confirm duplicate feedback. Verify that a member sees the list and that direct unauthorized create requests are denied. With more than 50 records, follow Next and First and switch locale through Account. Inspect safe empty, expired-session, invalid-cursor and unavailable responses. Capture visual evidence and the exact runtime revision through the established review launcher.

The production build and mocked tests are local evidence. The integration review supplies the real HTTP, browser, database and audit evidence before the coordinator publishes the feature PR.
