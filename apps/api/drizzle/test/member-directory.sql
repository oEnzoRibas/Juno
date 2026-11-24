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
BEGIN
  IF juno.read_member_directory(NULL) IS NOT NULL THEN RAISE EXCEPTION 'Missing context allowed access'; END IF;
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
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000002', true);
  IF juno.read_member_directory(NULL) IS NOT NULL THEN RAISE EXCEPTION 'Tenant crossover allowed'; END IF;
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000001', true);
  PERFORM set_config('juno.account_id', '20000000-0000-4000-8100-000000000003', true);
  IF juno.read_member_directory(NULL) IS NOT NULL THEN RAISE EXCEPTION 'Regular member access allowed'; END IF;
  BEGIN
    PERFORM email FROM juno.account;
    RAISE EXCEPTION 'Runtime role can read accounts directly';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END
$check$;
ROLLBACK;
\echo Member directory pagination, metadata scope, and denied access passed.
