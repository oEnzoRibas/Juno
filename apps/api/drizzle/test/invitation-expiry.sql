\set ON_ERROR_STOP on
BEGIN;

INSERT INTO juno.tenant (id, slug, name, accent_hex) VALUES
  ('00000000-0000-4000-8300-000000000001', 'expiry-check', 'Expiry Check', '#663399');

INSERT INTO juno.invitation (token_hash, tenant_id, email, role, expires_at) VALUES
  (decode(repeat('ab', 32), 'hex'), '00000000-0000-4000-8300-000000000001',
    'expiry-check@example.invalid', 'member', now() - interval '1 second');

SET LOCAL ROLE juno_app;
DO $check$
BEGIN
  IF juno.accept_invitation(decode(repeat('ab', 32), 'hex'), 'synthetic hash', NULL) IS NOT NULL THEN
    RAISE EXCEPTION 'An expired invitation was accepted';
  END IF;
  BEGIN
    PERFORM 1 FROM juno.invitation;
    RAISE EXCEPTION 'Runtime role read the invitation table directly';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
  BEGIN
    PERFORM 1 FROM juno.onboarding_audit;
    RAISE EXCEPTION 'Runtime role read the onboarding audit table directly';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  END;
END
$check$;

ROLLBACK;
\echo Invitation expiry and table privilege checks passed.
