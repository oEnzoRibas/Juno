CREATE SCHEMA juno;
--> statement-breakpoint
CREATE TABLE juno.account (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE CHECK (email = lower(email) AND char_length(email) BETWEEN 3 AND 254),
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE juno.tenant (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' AND char_length(slug) <= 63),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 120),
  accent_hex text NOT NULL CHECK (accent_hex ~ '^#[0-9A-Fa-f]{6}$'),
  created_at timestamptz NOT NULL DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE juno.membership (
  tenant_id uuid NOT NULL REFERENCES juno.tenant (id),
  account_id uuid NOT NULL REFERENCES juno.account (id),
  role text NOT NULL CHECK (role IN ('administrator', 'member')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (tenant_id, account_id)
);
--> statement-breakpoint
CREATE INDEX membership_account_id_idx ON juno.membership (account_id);
--> statement-breakpoint
ALTER TABLE juno.tenant ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.tenant FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.membership ENABLE ROW LEVEL SECURITY;
--> statement-breakpoint
ALTER TABLE juno.membership FORCE ROW LEVEL SECURITY;
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno TO juno_app;
--> statement-breakpoint
GRANT SELECT ON juno.tenant, juno.membership TO juno_app;
--> statement-breakpoint
CREATE POLICY membership_self_read ON juno.membership FOR SELECT TO juno_app USING (
  tenant_id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND account_id = nullif(current_setting('juno.account_id', true), '')::uuid
  AND active
);
--> statement-breakpoint
CREATE POLICY tenant_member_read ON juno.tenant FOR SELECT TO juno_app USING (
  id = nullif(current_setting('juno.tenant_id', true), '')::uuid
  AND EXISTS (SELECT 1 FROM juno.membership AS member WHERE member.tenant_id = tenant.id)
);
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (2);
