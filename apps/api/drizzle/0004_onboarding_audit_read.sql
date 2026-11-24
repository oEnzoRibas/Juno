CREATE ROLE juno_audit_reader NOLOGIN NOSUPERUSER NOBYPASSRLS;
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno TO juno_audit_reader;
--> statement-breakpoint
GRANT SELECT (tenant_id, account_id, active, role) ON juno.membership TO juno_audit_reader;
--> statement-breakpoint
GRANT SELECT (id, tenant_id, event, occurred_at) ON juno.onboarding_audit TO juno_audit_reader;
--> statement-breakpoint
CREATE POLICY audit_administrator_membership ON juno.membership
FOR SELECT TO juno_audit_reader USING (
  tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND account_id = nullif(current_setting('juno.account_id', true), '')::uuid
  AND active AND role = 'administrator'
);
--> statement-breakpoint
CREATE POLICY onboarding_audit_administrator_read ON juno.onboarding_audit
FOR SELECT TO juno_audit_reader USING (
  tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership AS membership WHERE membership.tenant_id = onboarding_audit.tenant_id)
);
--> statement-breakpoint
CREATE INDEX onboarding_audit_scope_recency_idx ON juno.onboarding_audit (tenant_id, occurred_at DESC, id DESC);
--> statement-breakpoint
CREATE FUNCTION juno.recent_onboarding_audit()
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
  SELECT CASE WHEN EXISTS (SELECT 1 FROM juno.membership) THEN (
    SELECT coalesce(
      json_agg(json_build_object('event', event, 'occurredAt', occurred_at) ORDER BY occurred_at DESC, id DESC),
      '[]'::json
    )
    FROM (
      SELECT id, event, occurred_at
      FROM juno.onboarding_audit
      WHERE tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
      ORDER BY occurred_at DESC, id DESC
      LIMIT 50
    ) AS recent
  ) END
$$;
--> statement-breakpoint
ALTER FUNCTION juno.recent_onboarding_audit() OWNER TO juno_audit_reader;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.recent_onboarding_audit() FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.recent_onboarding_audit() TO juno_app;
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (5);
