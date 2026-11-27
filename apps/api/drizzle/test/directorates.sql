\set ON_ERROR_STOP on
BEGIN;

INSERT INTO juno.tenant (id, slug, name, accent_hex) VALUES
 ('10000000-0000-4000-8100-000000000021', 'directorates-atlas', 'Fictional Atlas', '#7565F5'),
 ('10000000-0000-4000-8100-000000000022', 'directorates-boreal', 'Fictional Boreal', '#7565F5');
INSERT INTO juno.account (id, email, platform_admin) VALUES
 ('20000000-0000-4000-8100-000000000021', 'directorates-atlas@example.invalid', false),
 ('20000000-0000-4000-8100-000000000022', 'directorates-member@example.invalid', false),
 ('20000000-0000-4000-8100-000000000023', 'directorates-boreal@example.invalid', false),
 ('20000000-0000-4000-8100-000000000024', 'directorates-inactive@example.invalid', false),
 ('20000000-0000-4000-8100-000000000025', 'directorates-platform@example.invalid', true);
INSERT INTO juno.membership (tenant_id, account_id, role, active) VALUES
 ('10000000-0000-4000-8100-000000000021', '20000000-0000-4000-8100-000000000021', 'administrator', true),
 ('10000000-0000-4000-8100-000000000021', '20000000-0000-4000-8100-000000000022', 'member', true),
 ('10000000-0000-4000-8100-000000000022', '20000000-0000-4000-8100-000000000023', 'administrator', true),
 ('10000000-0000-4000-8100-000000000021', '20000000-0000-4000-8100-000000000024', 'administrator', false);

CREATE FUNCTION pg_temp.reject_test_directorate_audit() RETURNS trigger LANGUAGE plpgsql AS $trigger$
BEGIN
  IF current_setting('juno.test_reject_directorate_audit', true) = 'true' THEN
    RAISE EXCEPTION 'Synthetic directorate audit failure' USING ERRCODE = 'P0022';
  END IF;
  RETURN NEW;
END
$trigger$;
CREATE TRIGGER reject_test_directorate_audit BEFORE INSERT ON juno.directorate_audit
FOR EACH ROW EXECUTE FUNCTION pg_temp.reject_test_directorate_audit();

SET LOCAL ROLE juno_app;
DO $verify$
DECLARE
  atlas constant text := '10000000-0000-4000-8100-000000000021';
  boreal constant text := '10000000-0000-4000-8100-000000000022';
  administrator constant text := '20000000-0000-4000-8100-000000000021';
  member constant text := '20000000-0000-4000-8100-000000000022';
  foreign_administrator constant text := '20000000-0000-4000-8100-000000000023';
  actor text;
  created jsonb;
BEGIN
  IF juno.list_directorates() IS NOT NULL OR juno.create_directorate('Operations') IS NOT NULL THEN
    RAISE EXCEPTION 'Directorate access allowed without tenant and actor scope';
  END IF;
  PERFORM set_config('juno.tenant_id', atlas, true);
  FOREACH actor IN ARRAY ARRAY[
    foreign_administrator, '20000000-0000-4000-8100-000000000024', '20000000-0000-4000-8100-000000000025'
  ] LOOP
    PERFORM set_config('juno.account_id', actor, true);
    IF juno.list_directorates() IS NOT NULL OR juno.create_directorate('Operations') IS NOT NULL THEN
      RAISE EXCEPTION 'Directorate access allowed for an inactive, foreign or platform-only actor';
    END IF;
  END LOOP;
  RAISE NOTICE '[PASS] Missing, inactive, foreign and platform-only actors have no directorate access';

  PERFORM set_config('juno.account_id', member, true);
  IF juno.list_directorates()::jsonb IS DISTINCT FROM '{"items":[],"nextCursor":null}'::jsonb
    OR juno.create_directorate('Operations') IS NOT NULL THEN
    RAISE EXCEPTION 'Active regular member must have read-only directorate access';
  END IF;
  PERFORM set_config('juno.account_id', administrator, true);
  created := juno.create_directorate('  Gestão Interna  ')::jsonb;
  IF created->>'name' IS DISTINCT FROM 'Gestão Interna' OR created->>'id' IS NULL THEN
    RAISE EXCEPTION 'Authorized creation did not preserve the display name';
  END IF;
  IF juno.create_directorate('GESTÃO INTERNA')::jsonb IS DISTINCT FROM '{"duplicate":true}'::jsonb THEN
    RAISE EXCEPTION 'Equivalent name did not conflict within the tenant';
  END IF;

  PERFORM set_config('juno.tenant_id', boreal, true);
  PERFORM set_config('juno.account_id', foreign_administrator, true);
  IF juno.create_directorate('GESTÃO INTERNA')->>'id' IS NULL THEN
    RAISE EXCEPTION 'A separate tenant could not reuse the directorate name';
  END IF;
  PERFORM set_config('juno.tenant_id', atlas, true);
  PERFORM set_config('juno.account_id', member, true);
  IF juno.list_directorates()::jsonb IS DISTINCT FROM
    jsonb_build_object('items', jsonb_build_array(created), 'nextCursor', NULL) THEN
    RAISE EXCEPTION 'Active member did not read exactly the own-tenant directorate';
  END IF;
  RAISE NOTICE '[PASS] Own members can read and own administrators can create with tenant-scoped name uniqueness';

  BEGIN
    PERFORM directorate_id FROM juno.directorate_audit;
    RAISE EXCEPTION 'Runtime role may read private directorate audits';
  EXCEPTION WHEN insufficient_privilege THEN
    RAISE NOTICE '[PASS] Runtime role cannot read private directorate audits';
  END;

  PERFORM set_config('juno.account_id', administrator, true);
  PERFORM set_config('juno.test_reject_directorate_audit', 'true', true);
  BEGIN
    PERFORM juno.create_directorate('Must roll back');
    RAISE EXCEPTION 'Creation did not propagate the forced audit failure';
  EXCEPTION WHEN SQLSTATE 'P0022' THEN NULL;
  END;
  IF juno.list_directorates()::jsonb IS DISTINCT FROM
    jsonb_build_object('items', jsonb_build_array(created), 'nextCursor', NULL) THEN
    RAISE EXCEPTION 'A directorate survived its failed audit write';
  END IF;
  RAISE NOTICE '[PASS] Directorate creation is rolled back on audit failure';
END
$verify$;
RESET ROLE;

DO $verify$
BEGIN
  IF (SELECT count(*) FROM juno.directorate_audit
      WHERE tenant_id IN ('10000000-0000-4000-8100-000000000021', '10000000-0000-4000-8100-000000000022')) <> 2
    OR (SELECT count(*) FROM juno.directorate_audit audit
      JOIN juno.directorate directory
        ON audit.tenant_id = directory.tenant_id AND audit.directorate_id = directory.id
      WHERE (audit.tenant_id, audit.actor_id) IN (
        ('10000000-0000-4000-8100-000000000021'::uuid, '20000000-0000-4000-8100-000000000021'::uuid),
        ('10000000-0000-4000-8100-000000000022'::uuid, '20000000-0000-4000-8100-000000000023'::uuid)
      ) AND audit.occurred_at IS NOT NULL) <> 2 THEN
    RAISE EXCEPTION 'Expected exactly one scoped and attributed event per successful creation';
  END IF;
  RAISE NOTICE '[PASS] Two successful creations produce two audit rows with correct tenants, resources and actors';
END
$verify$;

ROLLBACK;
