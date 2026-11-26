CREATE ROLE juno_member_directory NOLOGIN NOSUPERUSER NOBYPASSRLS;
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno TO juno_member_directory;
--> statement-breakpoint
GRANT SELECT (tenant_id, account_id, role, active, created_at) ON juno.membership TO juno_member_directory;
--> statement-breakpoint
GRANT SELECT (id, email) ON juno.account TO juno_member_directory;
--> statement-breakpoint
CREATE POLICY member_directory_tenant_read ON juno.membership FOR SELECT TO juno_member_directory
USING (tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid);
--> statement-breakpoint
CREATE FUNCTION juno.read_member_directory(after_account uuid)
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
  WITH authorized AS (
    SELECT 1 FROM juno.membership
    WHERE account_id = nullif(current_setting('juno.account_id', true), '')::uuid
      AND active AND role = 'administrator'
  ), page AS (
    SELECT member.account_id, account.email, member.role, member.active, member.created_at
    FROM juno.membership AS member
    JOIN juno.account AS account ON account.id = member.account_id
    WHERE EXISTS (SELECT 1 FROM authorized) AND (after_account IS NULL OR member.account_id > after_account)
    ORDER BY member.account_id
    LIMIT 51
  )
  SELECT CASE WHEN EXISTS (SELECT 1 FROM authorized) THEN json_build_object(
    'items', coalesce((
      SELECT json_agg(json_build_object(
        'accountId', account_id, 'email', email, 'role', role, 'active', active, 'joinedAt', created_at
      ) ORDER BY account_id)
      FROM (SELECT * FROM page ORDER BY account_id LIMIT 50) AS visible
    ), '[]'::json),
    'nextCursor', CASE WHEN (SELECT count(*) FROM page) = 51
      THEN (SELECT account_id FROM page ORDER BY account_id OFFSET 49 LIMIT 1) END
  ) END
$$;
--> statement-breakpoint
ALTER FUNCTION juno.read_member_directory(uuid) OWNER TO juno_member_directory;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.read_member_directory(uuid) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.read_member_directory(uuid) TO juno_app;
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (6);
