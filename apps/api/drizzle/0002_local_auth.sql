ALTER TABLE juno.account
  ADD COLUMN password_hash text,
  ADD COLUMN platform_admin boolean NOT NULL DEFAULT false;
--> statement-breakpoint
CREATE TABLE juno.session (
  token_hash bytea PRIMARY KEY CHECK (octet_length(token_hash) = 32),
  account_id uuid NOT NULL REFERENCES juno.account (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
--> statement-breakpoint
CREATE INDEX session_expires_at_idx ON juno.session (expires_at);
--> statement-breakpoint
CREATE TABLE juno.login_budget (
  key bytea NOT NULL,
  bucket bigint NOT NULL,
  attempts integer NOT NULL CHECK (attempts > 0),
  PRIMARY KEY (key, bucket)
);
--> statement-breakpoint
GRANT SELECT, INSERT, DELETE ON juno.session TO juno_app;
--> statement-breakpoint
GRANT SELECT, INSERT, UPDATE, DELETE ON juno.login_budget TO juno_app;
--> statement-breakpoint
CREATE ROLE juno_auth_reader NOLOGIN NOSUPERUSER NOBYPASSRLS;
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno TO juno_auth_reader;
--> statement-breakpoint
GRANT SELECT (id, email, password_hash, platform_admin) ON juno.account TO juno_auth_reader;
--> statement-breakpoint
GRANT SELECT ON juno.session TO juno_auth_reader;
--> statement-breakpoint
CREATE FUNCTION juno.credential_for_email(input_email text)
RETURNS TABLE (id uuid, password_hash text)
LANGUAGE sql STABLE STRICT SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
  SELECT account.id, account.password_hash FROM juno.account
  WHERE account.email = input_email AND account.password_hash IS NOT NULL
$$;
--> statement-breakpoint
ALTER FUNCTION juno.credential_for_email(text) OWNER TO juno_auth_reader;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.credential_for_email(text) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.credential_for_email(text) TO juno_app;
--> statement-breakpoint
CREATE FUNCTION juno.identity_for_session(input_hash bytea)
RETURNS TABLE (id uuid, email text, platform_admin boolean)
LANGUAGE sql STABLE STRICT SECURITY DEFINER SET search_path = pg_catalog, pg_temp
AS $$
  SELECT account.id, account.email, account.platform_admin
  FROM juno.session JOIN juno.account ON session.account_id = account.id
  WHERE session.token_hash = input_hash AND session.expires_at > now()
    AND account.password_hash IS NOT NULL
$$;
--> statement-breakpoint
ALTER FUNCTION juno.identity_for_session(bytea) OWNER TO juno_auth_reader;
--> statement-breakpoint
REVOKE ALL ON FUNCTION juno.identity_for_session(bytea) FROM PUBLIC;
--> statement-breakpoint
GRANT EXECUTE ON FUNCTION juno.identity_for_session(bytea) TO juno_app;
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (3);
