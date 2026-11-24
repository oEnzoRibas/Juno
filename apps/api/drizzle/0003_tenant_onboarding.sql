CREATE TABLE juno.invitation (
  token_hash bytea PRIMARY KEY CHECK (octet_length(token_hash) = 32),
  tenant_id uuid NOT NULL REFERENCES juno.tenant (id),
  email text NOT NULL CHECK (email = lower(email) AND char_length(email) BETWEEN 3 AND 254),
  role text NOT NULL CHECK (role IN ('administrator', 'member')),
  expires_at timestamptz NOT NULL,
  used_at timestamptz,
  UNIQUE (tenant_id, email)
);
--> statement-breakpoint
CREATE TABLE juno.onboarding_audit (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tenant_id uuid NOT NULL REFERENCES juno.tenant (id),
  actor_id uuid NOT NULL REFERENCES juno.account (id),
  event text NOT NULL CHECK (event IN ('tenant_created', 'invitation_issued', 'invitation_accepted')),
  occurred_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE juno.invitation ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.invitation FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.onboarding_audit ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.onboarding_audit FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
CREATE ROLE juno_onboarding NOLOGIN NOSUPERUSER NOBYPASSRLS;
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno TO juno_onboarding;
--> statement-breakpoint
GRANT SELECT (id, email, platform_admin), INSERT (email, password_hash) ON juno.account TO juno_onboarding;
--> statement-breakpoint
GRANT SELECT, INSERT ON juno.tenant, juno.membership TO juno_onboarding;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE ON juno.invitation TO juno_onboarding;
--> statement-breakpoint
GRANT INSERT ON juno.onboarding_audit TO juno_onboarding;
--> statement-breakpoint
CREATE POLICY onboarding_tenant ON juno.tenant TO juno_onboarding USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY onboarding_membership ON juno.membership TO juno_onboarding USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY onboarding_invitation ON juno.invitation TO juno_onboarding USING (true) WITH CHECK (true);
--> statement-breakpoint
CREATE POLICY onboarding_audit_append ON juno.onboarding_audit FOR INSERT TO juno_onboarding WITH CHECK (true);
--> statement-breakpoint
CREATE FUNCTION juno.provision_tenant(actor uuid, input_slug text, input_name text, input_accent text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
DECLARE created uuid;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM juno.account WHERE id = actor AND platform_admin) THEN
    RETURN NULL;
  END IF;

  INSERT INTO juno.tenant (slug, name, accent_hex)
  VALUES (input_slug, input_name, input_accent) RETURNING id INTO created;
  INSERT INTO juno.onboarding_audit (tenant_id, actor_id, event) VALUES (created, actor, 'tenant_created');
  RETURN created;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION juno.issue_invitation(actor uuid, scope uuid, input_email text, input_role text, input_hash bytea)
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM juno.tenant WHERE id = scope) OR NOT (
    EXISTS (SELECT 1 FROM juno.account WHERE id = actor AND platform_admin) OR (
      input_role = 'member' AND EXISTS (
        SELECT 1 FROM juno.membership
        WHERE tenant_id = scope AND account_id = actor AND active AND role = 'administrator'
      )
    )
  ) THEN
    RETURN false;
  END IF;

  INSERT INTO juno.invitation (token_hash, tenant_id, email, role, expires_at)
  VALUES (input_hash, scope, input_email, input_role, now() + interval '24 hours')
  ON CONFLICT (tenant_id, email) DO UPDATE
    SET token_hash = excluded.token_hash, role = excluded.role, expires_at = excluded.expires_at
    WHERE juno.invitation.used_at IS NULL;
  IF NOT FOUND THEN RETURN false; END IF;

  INSERT INTO juno.onboarding_audit (tenant_id, actor_id, event) VALUES (scope, actor, 'invitation_issued');
  RETURN true;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION juno.accept_invitation(input_hash bytea, input_password_hash text, existing_actor uuid)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
DECLARE pending juno.invitation%ROWTYPE;
DECLARE account_key uuid;
BEGIN
  SELECT * INTO pending FROM juno.invitation
    WHERE token_hash = input_hash AND used_at IS NULL AND expires_at > now() FOR UPDATE;
  IF NOT FOUND THEN RETURN NULL; END IF;

  IF existing_actor IS NULL THEN
    IF input_password_hash IS NULL THEN RETURN NULL; END IF;
    INSERT INTO juno.account (email, password_hash) VALUES (pending.email, input_password_hash)
      ON CONFLICT (email) DO NOTHING RETURNING id INTO account_key;
  ELSE
    SELECT id INTO account_key FROM juno.account WHERE id = existing_actor AND email = pending.email;
  END IF;
  IF account_key IS NULL THEN RETURN NULL; END IF;

  INSERT INTO juno.membership (tenant_id, account_id, role)
    VALUES (pending.tenant_id, account_key, pending.role) ON CONFLICT DO NOTHING;
  IF NOT FOUND THEN RETURN NULL; END IF;

  UPDATE juno.invitation SET used_at = now() WHERE token_hash = input_hash;
  INSERT INTO juno.onboarding_audit (tenant_id, actor_id, event)
    VALUES (pending.tenant_id, account_key, 'invitation_accepted');
  RETURN pending.tenant_id;
END;
$$;
--> statement-breakpoint
CREATE FUNCTION juno.workspaces_for_account(actor uuid)
RETURNS TABLE (id uuid, name text, role text)
LANGUAGE sql STABLE STRICT SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
  SELECT tenant.id, tenant.name, membership.role
  FROM juno.membership JOIN juno.tenant ON membership.tenant_id = tenant.id
  WHERE membership.account_id = actor AND membership.active
  ORDER BY tenant.name, tenant.id
$$;
--> statement-breakpoint
ALTER FUNCTION juno.provision_tenant(uuid, text, text, text) OWNER TO juno_onboarding;
--> statement-breakpoint
ALTER FUNCTION juno.issue_invitation(uuid, uuid, text, text, bytea) OWNER TO juno_onboarding;
--> statement-breakpoint
ALTER FUNCTION juno.accept_invitation(bytea, text, uuid) OWNER TO juno_onboarding;
--> statement-breakpoint
ALTER FUNCTION juno.workspaces_for_account(uuid) OWNER TO juno_onboarding;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.provision_tenant(uuid, text, text, text), juno.issue_invitation(uuid, uuid, text, text, bytea),
  juno.accept_invitation(bytea, text, uuid), juno.workspaces_for_account(uuid) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.provision_tenant(uuid, text, text, text), juno.issue_invitation(uuid, uuid, text, text, bytea),
  juno.accept_invitation(bytea, text, uuid), juno.workspaces_for_account(uuid) TO juno_app;
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (4);
