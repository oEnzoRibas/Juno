\set ON_ERROR_STOP on
BEGIN;
INSERT INTO juno.account (id, email, platform_admin) VALUES
  ('00000000-0000-4000-8400-000000000001', 'audit-admin@example.invalid', false),
  ('00000000-0000-4000-8400-000000000002', 'audit-member@example.invalid', false),
  ('00000000-0000-4000-8400-000000000003', 'audit-platform@example.invalid', true),
  ('00000000-0000-4000-8400-000000000004', 'audit-revoked@example.invalid', false);
INSERT INTO juno.tenant (id, slug, name, accent_hex) VALUES
  ('00000000-0000-4000-8500-000000000001', 'audit-own', 'Audit Own', '#663399'),
  ('00000000-0000-4000-8500-000000000002', 'audit-other', 'Audit Other', '#663399');
INSERT INTO juno.membership (tenant_id, account_id, role, active) VALUES
  ('00000000-0000-4000-8500-000000000001', '00000000-0000-4000-8400-000000000001', 'administrator', true),
  ('00000000-0000-4000-8500-000000000001', '00000000-0000-4000-8400-000000000002', 'member', true),
  ('00000000-0000-4000-8500-000000000001', '00000000-0000-4000-8400-000000000004', 'administrator', false);
INSERT INTO juno.onboarding_audit (tenant_id, actor_id, event, occurred_at)
SELECT '00000000-0000-4000-8500-000000000001', '00000000-0000-4000-8400-000000000003',
  'tenant_created', '2026-01-01 00:00+00'::timestamptz + n * interval '1 day'
FROM generate_series(1,52) AS n;
INSERT INTO juno.onboarding_audit (tenant_id, actor_id, event) VALUES
  ('00000000-0000-4000-8500-000000000002', '00000000-0000-4000-8400-000000000003', 'invitation_issued');

SET LOCAL ROLE juno_app;
DO $check$
DECLARE events jsonb;
BEGIN
  IF juno.recent_onboarding_audit() IS NOT NULL THEN RAISE EXCEPTION 'Missing scope allowed audit access'; END IF;
  PERFORM set_config('juno.tenant_id', '00000000-0000-4000-8500-000000000001', true);
  PERFORM set_config('juno.account_id', '00000000-0000-4000-8400-000000000001', true);
  events := juno.recent_onboarding_audit();
  IF events IS NULL OR jsonb_array_length(events) <> 50
    OR EXISTS (SELECT 1 FROM jsonb_array_elements(events) AS entry WHERE (entry - 'event' - 'occurredAt') <> '{}'::jsonb
      OR entry->>'event' IS DISTINCT FROM 'tenant_created')
    OR (events->0->>'occurredAt')::timestamptz <= (events->49->>'occurredAt')::timestamptz THEN
    RAISE EXCEPTION 'Own audit list failed the limit, ordering, isolation or redaction check';
  END IF;

  PERFORM set_config('juno.tenant_id', '00000000-0000-4000-8500-000000000002', true);
  IF juno.recent_onboarding_audit() IS NOT NULL THEN RAISE EXCEPTION 'Cross-tenant audit access'; END IF;
  PERFORM set_config('juno.tenant_id', '00000000-0000-4000-8500-000000000001', true);
  FOR i IN 2..4 LOOP
    PERFORM set_config('juno.account_id', '00000000-0000-4000-8400-00000000000' || i, true);
    IF juno.recent_onboarding_audit() IS NOT NULL THEN RAISE EXCEPTION 'Unqualified account read the audit'; END IF;
  END LOOP;

  BEGIN
    DELETE FROM juno.onboarding_audit;
    RAISE EXCEPTION 'Runtime role deleted audit records';
  EXCEPTION WHEN insufficient_privilege THEN NULL;
  END;
END
$check$;
ROLLBACK;
\echo Onboarding audit eligibility, redaction, integrity and isolation passed.
