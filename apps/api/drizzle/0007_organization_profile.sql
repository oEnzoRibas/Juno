CREATE ROLE juno_organization_profile NOLOGIN NOSUPERUSER NOBYPASSRLS;
--> statement-breakpoint
CREATE TABLE juno.organization_profile_audit (
  tenant_id uuid NOT NULL REFERENCES juno.tenant (id),
  id bigint GENERATED ALWAYS AS IDENTITY,
  actor_id uuid NOT NULL REFERENCES juno.account (id),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, id)
);
--> statement-breakpoint
ALTER TABLE juno.organization_profile_audit ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.organization_profile_audit FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno TO juno_organization_profile;
--> statement-breakpoint
GRANT SELECT (id, name, accent_hex), UPDATE (name, accent_hex) ON juno.tenant TO juno_organization_profile;
--> statement-breakpoint
GRANT SELECT (tenant_id, account_id, active, role) ON juno.membership TO juno_organization_profile;
--> statement-breakpoint
GRANT INSERT (tenant_id, actor_id) ON juno.organization_profile_audit TO juno_organization_profile;
--> statement-breakpoint
CREATE POLICY organization_profile_membership ON juno.membership FOR SELECT TO juno_organization_profile
USING (tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND account_id = nullif(current_setting('juno.account_id', true), '')::uuid AND active AND role = 'administrator');
--> statement-breakpoint
CREATE POLICY organization_profile_tenant ON juno.tenant TO juno_organization_profile
USING (id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership WHERE tenant_id = tenant.id))
WITH CHECK (id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership WHERE tenant_id = tenant.id));
--> statement-breakpoint
CREATE POLICY organization_profile_audit_append ON juno.organization_profile_audit FOR INSERT TO juno_organization_profile
WITH CHECK (tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND actor_id = nullif(current_setting('juno.account_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership WHERE membership.tenant_id = organization_profile_audit.tenant_id));
--> statement-breakpoint
CREATE FUNCTION juno.replace_organization_profile(profile_name text, profile_accent text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  scope uuid := nullif(current_setting('juno.tenant_id', true), '')::uuid;
  actor uuid := nullif(current_setting('juno.account_id', true), '')::uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM juno.membership WHERE tenant_id = scope AND account_id = actor) THEN
    RETURN NULL;
  END IF;

  UPDATE juno.tenant SET name = profile_name, accent_hex = profile_accent
  WHERE id = scope AND (name, accent_hex) IS DISTINCT FROM (profile_name, profile_accent);

  IF FOUND THEN
    INSERT INTO juno.organization_profile_audit (tenant_id, actor_id) VALUES (scope, actor);
  END IF;
  RETURN json_build_object('id', scope, 'name', profile_name, 'accent', profile_accent);
END;
$$;
--> statement-breakpoint
ALTER FUNCTION juno.replace_organization_profile(text, text) OWNER TO juno_organization_profile;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.replace_organization_profile(text, text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.replace_organization_profile(text, text) TO juno_app;
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (8);
