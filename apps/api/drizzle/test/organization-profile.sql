\set ON_ERROR_STOP on
BEGIN;
INSERT INTO juno.tenant (id, slug, name, accent_hex) VALUES
 ('10000000-0000-4000-8100-000000000011', 'profile-one', 'Fictional One', '#7565F5'),
 ('10000000-0000-4000-8100-000000000012', 'profile-two', 'Fictional Two', '#7565F5');
INSERT INTO juno.account (id, email, platform_admin) VALUES
 ('20000000-0000-4000-8100-000000000011', 'profile-admin@example.invalid', false),
 ('20000000-0000-4000-8100-000000000012', 'profile-member@example.invalid', false),
 ('20000000-0000-4000-8100-000000000013', 'profile-platform@example.invalid', true),
 ('20000000-0000-4000-8100-000000000014', 'profile-inactive@example.invalid', false);
INSERT INTO juno.membership (tenant_id, account_id, role, active) VALUES
 ('10000000-0000-4000-8100-000000000011', '20000000-0000-4000-8100-000000000011', 'administrator', true),
 ('10000000-0000-4000-8100-000000000011', '20000000-0000-4000-8100-000000000012', 'member', true),
 ('10000000-0000-4000-8100-000000000011', '20000000-0000-4000-8100-000000000014', 'administrator', false);
SET LOCAL ROLE juno_app;
DO $verify$
DECLARE actor uuid;
BEGIN
  IF juno.replace_organization_profile('Missing scope', '#101010') IS NOT NULL THEN
    RAISE EXCEPTION 'Profile write allowed without scope';
  END IF;
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000011', true);
  FOREACH actor IN ARRAY ARRAY[
    '20000000-0000-4000-8100-000000000012'::uuid, '20000000-0000-4000-8100-000000000013'::uuid,
    '20000000-0000-4000-8100-000000000014'::uuid
  ] LOOP
    PERFORM set_config('juno.account_id', actor::text, true);
    IF juno.replace_organization_profile('Unauthorized update', '#101010') IS NOT NULL THEN
      RAISE EXCEPTION 'Profile write allowed without active administrator membership';
    END IF;
  END LOOP;
  PERFORM set_config('juno.account_id', '20000000-0000-4000-8100-000000000011', true);
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000012', true);
  IF juno.replace_organization_profile('Foreign update', '#101010') IS NOT NULL THEN
    RAISE EXCEPTION 'Profile write allowed in foreign tenant';
  END IF;
  PERFORM set_config('juno.tenant_id', '10000000-0000-4000-8100-000000000011', true);
  IF juno.replace_organization_profile('Updated Fictional One', '#112233')->>'name' IS DISTINCT FROM 'Updated Fictional One' THEN
    RAISE EXCEPTION 'Authorized replacement did not succeed';
  END IF;
  PERFORM juno.replace_organization_profile('Updated Fictional One', '#112233');
  BEGIN
    PERFORM id FROM juno.organization_profile_audit;
    RAISE EXCEPTION 'Runtime may query audit directly';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END
$verify$;
RESET ROLE;
DO $verify$
BEGIN
  IF (SELECT count(*) FROM juno.organization_profile_audit
      WHERE tenant_id = '10000000-0000-4000-8100-000000000011'
        AND actor_id = '20000000-0000-4000-8100-000000000011') <> 1 THEN
    RAISE EXCEPTION 'Expected one committed delta event for retries';
  END IF;
  IF EXISTS (SELECT 1 FROM juno.tenant WHERE slug = 'profile-two' AND name <> 'Fictional Two') THEN
    RAISE EXCEPTION 'Other tenant was modified';
  END IF;
END
$verify$;
ROLLBACK;
\echo Organization profile authority, isolation and audit passed.
