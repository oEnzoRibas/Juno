\set ON_ERROR_STOP on
BEGIN;
INSERT INTO juno.tenant (id, slug, name, accent_hex) VALUES
  ('10000000-0000-4000-8100-000000000001', 'directory-test-one', 'Fictional One', '#7565F5'),
  ('10000000-0000-4000-8100-000000000002', 'directory-test-two', 'Fictional Two', '#7565F5');
INSERT INTO juno.account (id, email)
SELECT ('20000000-0000-4000-8100-' || lpad(n::text, 12, '0'))::uuid,
  'directory-fixture-' || n || '@example.invalid'
FROM generate_series(1, 53) AS n;
INSERT INTO juno.membership (tenant_id, account_id, role, active)
SELECT '10000000-0000-4000-8100-000000000001', id,
  CASE WHEN email LIKE 'directory-fixture-1@%' THEN 'administrator' ELSE 'member' END,
  email NOT LIKE 'directory-fixture-2@%'
FROM juno.account WHERE email LIKE 'directory-fixture-%@example.invalid' AND email NOT LIKE 'directory-fixture-53@%';
INSERT INTO juno.membership (tenant_id, account_id, role) VALUES
  ('10000000-0000-4000-8100-000000000002', '20000000-0000-4000-8100-000000000053', 'administrator');
SET LOCAL ROLE juno_app;
DO $check$
DECLARE first_page jsonb;
DECLARE second_page jsonb;
DECLARE filtered_page jsonb;
DECLARE filtered_tail jsonb;
BEGIN
  IF juno.read_member_directory(NULL) IS NOT NULL
    OR juno.search_member_directory(NULL, NULL, NULL, NULL, NULL) IS NOT NULL
    THEN RAISE EXCEPTION 'Missing context allowed access'; END IF;
  RAISE NOTICE '[PASS] Missing SQL scope receives neither directory nor search results';
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000001', true);
  PERFORM set_config('juno.account_id', '20000000-0000-4000-8100-000000000001', true);
  first_page := juno.read_member_directory(NULL);
  second_page := juno.read_member_directory((first_page->>'nextCursor')::uuid);
  IF first_page IS NULL OR jsonb_array_length(first_page->'items') <> 50
    OR first_page->>'nextCursor' IS DISTINCT FROM '20000000-0000-4000-8100-000000000050'
    OR second_page IS NULL OR jsonb_array_length(second_page->'items') <> 2
    OR second_page->>'nextCursor' IS NOT NULL
    OR (first_page->'items'->1->>'active')::boolean IS DISTINCT FROM false
    OR EXISTS (
      SELECT 1 FROM jsonb_array_elements(second_page->'items') AS item
      WHERE item->>'email' = 'directory-fixture-53@example.invalid'
    ) THEN RAISE EXCEPTION 'Directory page, scope or inactive record differs'; END IF;
  RAISE NOTICE '[PASS] Directory parent preserves 50+2 bounded rows, cursor and inactive metadata';
  filtered_page := juno.search_member_directory(NULL, 'DIRECTORY-FIXTURE-', NULL, true, NULL);
  filtered_tail := juno.search_member_directory((filtered_page->>'nextCursor')::uuid, 'DIRECTORY-FIXTURE-', NULL, true, NULL);
  IF jsonb_array_length(filtered_page->'items') IS DISTINCT FROM 50
    OR jsonb_array_length(filtered_tail->'items') IS DISTINCT FROM 1
    OR filtered_tail->>'nextCursor' IS NOT NULL
    OR filtered_page->>'nextCursor' IS DISTINCT FROM '20000000-0000-4000-8100-000000000051'
    THEN RAISE EXCEPTION 'Filtered cursor or page differs'; END IF;
  RAISE NOTICE '[PASS] Active prefix filter preserves the cursor and excludes inactive rows | Expected 50+1 | Actual %+%',
    jsonb_array_length(filtered_page->'items'), jsonb_array_length(filtered_tail->'items');
  filtered_page := juno.search_member_directory(NULL, 'DIRECTORY-FIXTURE-', 'member', false, NULL);
  IF jsonb_array_length(filtered_page->'items') IS DISTINCT FROM 1
    OR filtered_page->'items'->0->>'accountId' IS DISTINCT FROM '20000000-0000-4000-8100-000000000002'
  THEN RAISE EXCEPTION 'Filtered inactive member differs'; END IF;
  RAISE NOTICE '[PASS] Case-insensitive prefix, role and inactive state identify the expected own member';
  IF jsonb_array_length(juno.search_member_directory(NULL, 'directory-fixture-%', NULL, NULL, NULL)::jsonb->'items') IS DISTINCT FROM 0
    OR jsonb_array_length(juno.search_member_directory(NULL, 'directory_fixture-', NULL, NULL, NULL)::jsonb->'items') IS DISTINCT FROM 0
    THEN RAISE EXCEPTION 'Wildcard characters were not treated literally'; END IF;
  RAISE NOTICE '[PASS] SQL prefix comparison treats percent and underscore literally';
  filtered_page := juno.search_member_directory(NULL, NULL, NULL, NULL, '20000000-0000-4000-8100-000000000053');
  IF jsonb_array_length(filtered_page->'items') IS DISTINCT FROM 0
  THEN RAISE EXCEPTION 'Other tenant detail was visible'; END IF;
  RAISE NOTICE '[PASS] Own-tenant search excludes the foreign account identifier';
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000002', true);
  IF juno.read_member_directory(NULL) IS NOT NULL THEN RAISE EXCEPTION 'Tenant crossover allowed'; END IF;
  RAISE NOTICE '[PASS] Foreign tenant directory is denied';
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000001', true);
  PERFORM set_config('juno.account_id', '20000000-0000-4000-8100-000000000003', true);
  IF juno.search_member_directory(NULL, NULL, NULL, NULL, '20000000-0000-4000-8100-000000000003') IS NOT NULL THEN RAISE EXCEPTION 'Regular member access allowed'; END IF;
  RAISE NOTICE '[PASS] Regular member is denied own-tenant detail';
  BEGIN
    PERFORM email FROM juno.account;
    RAISE EXCEPTION 'Runtime role can read accounts directly';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE '[PASS] Runtime role lacks direct account email access';
  END;
END
$check$;
ROLLBACK;
\echo Member directory pagination, metadata scope, and denied access passed.
