CREATE ROLE juno_directorates NOLOGIN NOSUPERUSER NOBYPASSRLS;
--> statement-breakpoint
CREATE COLLATION juno.directorate_name_ci (provider = icu, locale = 'und-u-ks-level2', deterministic = false);
--> statement-breakpoint
CREATE TABLE juno.directorate (
  tenant_id uuid NOT NULL REFERENCES juno.tenant (id),
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text COLLATE juno.directorate_name_ci NOT NULL
    CHECK (char_length(name) BETWEEN 1 AND 120 AND name COLLATE "C" !~ U&'[\0001-\001F\007F-\009F]'),
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, id),
  CONSTRAINT directorate_tenant_name_unique UNIQUE (tenant_id, name)
);
--> statement-breakpoint
CREATE TABLE juno.directorate_audit (
  tenant_id uuid NOT NULL,
  directorate_id uuid NOT NULL,
  actor_id uuid NOT NULL REFERENCES juno.account (id),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, directorate_id),
  FOREIGN KEY (tenant_id, directorate_id) REFERENCES juno.directorate (tenant_id, id)
);
--> statement-breakpoint
ALTER TABLE juno.directorate ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.directorate FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.directorate_audit ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.directorate_audit FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno TO juno_directorates;
--> statement-breakpoint
GRANT SELECT (tenant_id, account_id, role, active) ON juno.membership TO juno_directorates;
--> statement-breakpoint
GRANT SELECT (tenant_id, id, name), INSERT (tenant_id, name) ON juno.directorate TO juno_directorates;
--> statement-breakpoint
GRANT INSERT (tenant_id, directorate_id, actor_id) ON juno.directorate_audit TO juno_directorates;
--> statement-breakpoint
CREATE POLICY directorate_membership_self ON juno.membership FOR SELECT TO juno_directorates
USING (tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND account_id = nullif(current_setting('juno.account_id', true), '')::uuid AND active);
--> statement-breakpoint
CREATE POLICY directorate_member_read ON juno.directorate FOR SELECT TO juno_directorates
USING (tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership WHERE membership.tenant_id = directorate.tenant_id));
--> statement-breakpoint
CREATE POLICY directorate_administrator_create ON juno.directorate FOR INSERT TO juno_directorates
WITH CHECK (tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership WHERE membership.tenant_id = directorate.tenant_id AND role = 'administrator'));
--> statement-breakpoint
CREATE POLICY directorate_audit_append ON juno.directorate_audit FOR INSERT TO juno_directorates
WITH CHECK (tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND actor_id = nullif(current_setting('juno.account_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership WHERE membership.tenant_id = directorate_audit.tenant_id AND role = 'administrator'));
--> statement-breakpoint
CREATE FUNCTION juno.list_directorates(after_id uuid DEFAULT NULL)
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
  WITH scope AS (
    SELECT tenant_id FROM juno.membership
    WHERE tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
      AND account_id = nullif(current_setting('juno.account_id', true), '')::uuid
  ), candidates AS (
    SELECT directorate.id, directorate.name FROM scope
    JOIN juno.directorate ON directorate.tenant_id = scope.tenant_id
    WHERE after_id IS NULL OR directorate.id > after_id
    ORDER BY directorate.id LIMIT 51
  ), page AS (
    SELECT id, name FROM candidates ORDER BY id LIMIT 50
  )
  SELECT json_build_object(
    'items', coalesce((SELECT json_agg(json_build_object('id', id, 'name', name) ORDER BY id) FROM page), '[]'::json),
    'nextCursor', CASE WHEN (SELECT count(*) FROM candidates) > 50 THEN
      (SELECT id FROM page ORDER BY id DESC LIMIT 1) END
  ) FROM scope;
$$;
--> statement-breakpoint
CREATE FUNCTION juno.create_directorate(directorate_name text)
RETURNS json LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, pg_temp AS $$
DECLARE
  scope uuid := nullif(current_setting('juno.tenant_id', true), '')::uuid;
  actor uuid := nullif(current_setting('juno.account_id', true), '')::uuid;
  -- Match the whitespace accepted at the HTTP boundary, including NBSP and BOM.
  display_name text := btrim(directorate_name, U&'\0009\000A\000B\000C\000D\0020\00A0\1680\2000\2001\2002\2003\2004\2005\2006\2007\2008\2009\200A\2028\2029\202F\205F\3000\FEFF');
  created_id uuid;
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM juno.membership WHERE tenant_id = scope AND account_id = actor AND role = 'administrator'
  ) THEN RETURN NULL;
  END IF;

  INSERT INTO juno.directorate (tenant_id, name) VALUES (scope, display_name)
  ON CONFLICT ON CONSTRAINT directorate_tenant_name_unique DO NOTHING
  RETURNING id INTO created_id;
  IF NOT FOUND THEN RETURN json_build_object('duplicate', true);
  END IF;

  INSERT INTO juno.directorate_audit (tenant_id, directorate_id, actor_id) VALUES (scope, created_id, actor);
  RETURN json_build_object('id', created_id, 'name', display_name);
END;
$$;
--> statement-breakpoint
ALTER FUNCTION juno.list_directorates(uuid) OWNER TO juno_directorates;
--> statement-breakpoint
ALTER FUNCTION juno.create_directorate(text) OWNER TO juno_directorates;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.list_directorates(uuid), juno.create_directorate(text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.list_directorates(uuid), juno.create_directorate(text) TO juno_app;
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (9);
