CREATE FUNCTION juno.search_member_directory(after_account uuid, email_prefix text, member_role text, member_active boolean, target_account uuid)
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
      AND (email_prefix IS NULL OR starts_with(lower(account.email), lower(email_prefix)))
      AND (member_role IS NULL OR member.role::text = member_role)
      AND (member_active IS NULL OR member.active = member_active)
      AND (target_account IS NULL OR member.account_id = target_account)
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
ALTER FUNCTION juno.search_member_directory(uuid, text, text, boolean, uuid) OWNER TO juno_member_directory;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.search_member_directory(uuid, text, text, boolean, uuid) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.search_member_directory(uuid, text, text, boolean, uuid) TO juno_app;
--> statement-breakpoint
CREATE OR REPLACE FUNCTION juno.read_member_directory(after_account uuid)
RETURNS json LANGUAGE sql STABLE SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
  SELECT juno.search_member_directory(after_account, NULL, NULL, NULL, NULL)
$$;
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (7);
