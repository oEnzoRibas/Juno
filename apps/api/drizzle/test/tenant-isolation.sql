\set ON_ERROR_STOP on
BEGIN;

INSERT INTO juno.account (id, email) VALUES
  ('00000000-0000-4000-8100-000000000001', 'tenant-one@example.invalid'),
  ('00000000-0000-4000-8100-000000000002', 'tenant-two@example.invalid');

INSERT INTO juno.tenant (id, slug, name, accent_hex) VALUES
  ('00000000-0000-4000-8200-000000000001', 'test-one', 'Test One', '#663399'),
  ('00000000-0000-4000-8200-000000000002', 'test-two', 'Test Two', '#554499'),
  ('00000000-0000-4000-8200-000000000003', 'test-three', 'Test Three', '#554499');

INSERT INTO juno.membership (tenant_id, account_id, role, active) VALUES
  ('00000000-0000-4000-8200-000000000001', '00000000-0000-4000-8100-000000000001', 'administrator', true),
  ('00000000-0000-4000-8200-000000000002', '00000000-0000-4000-8100-000000000002', 'member', true),
  ('00000000-0000-4000-8200-000000000003', '00000000-0000-4000-8100-000000000001', 'member', false);

SET LOCAL ROLE juno_app;
DO $check$
BEGIN
  IF EXISTS (SELECT 1 FROM juno.tenant) OR EXISTS (SELECT 1 FROM juno.membership) THEN
    RAISE EXCEPTION 'Missing transaction scope allowed data access';
  END IF;

  PERFORM set_config('juno.account_id', '00000000-0000-4000-8100-000000000001', true);
  PERFORM set_config('juno.tenant_id', '00000000-0000-4000-8200-000000000001', true);
  IF (SELECT array_agg(slug) FROM juno.tenant) IS DISTINCT FROM ARRAY['test-one']
    OR (SELECT array_agg(role) FROM juno.membership) IS DISTINCT FROM ARRAY['administrator'] THEN
    RAISE EXCEPTION 'Tenant administrator visibility was incorrect';
  END IF;
  IF EXISTS (SELECT 1 FROM juno.tenant WHERE slug = 'test-two') THEN
    RAISE EXCEPTION 'Direct lookup exposed another tenant';
  END IF;

  PERFORM set_config('juno.tenant_id', '00000000-0000-4000-8200-000000000002', true);
  IF EXISTS (SELECT 1 FROM juno.tenant) OR EXISTS (SELECT 1 FROM juno.membership) THEN
    RAISE EXCEPTION 'Changing tenant scope without membership granted access';
  END IF;

  PERFORM set_config('juno.tenant_id', '00000000-0000-4000-8200-000000000003', true);
  IF EXISTS (SELECT 1 FROM juno.tenant) OR EXISTS (SELECT 1 FROM juno.membership) THEN
    RAISE EXCEPTION 'Inactive membership granted access';
  END IF;

  PERFORM set_config('juno.account_id', '00000000-0000-4000-8100-000000000002', true);
  PERFORM set_config('juno.tenant_id', '00000000-0000-4000-8200-000000000002', true);
  IF (SELECT array_agg(slug) FROM juno.tenant) IS DISTINCT FROM ARRAY['test-two']
    OR (SELECT array_agg(role) FROM juno.membership) IS DISTINCT FROM ARRAY['member'] THEN
    RAISE EXCEPTION 'Tenant member visibility was incorrect';
  END IF;

  BEGIN
    UPDATE juno.tenant SET name = 'Unexpected' WHERE slug = 'test-two';
    RAISE EXCEPTION 'Runtime role modified a tenant';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
  BEGIN
    PERFORM 1 FROM juno.account;
    RAISE EXCEPTION 'Runtime role read the global identity table';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
END
$check$;
ROLLBACK;

BEGIN;
SET LOCAL ROLE juno_app;
DO $check$
BEGIN
  IF nullif(current_setting('juno.account_id', true), '') IS NOT NULL
    OR nullif(current_setting('juno.tenant_id', true), '') IS NOT NULL THEN
    RAISE EXCEPTION 'Scope persisted on a reused connection';
  END IF;
END
$check$;
ROLLBACK;
\echo Tenant visibility, write denial and transaction cleanup passed.
