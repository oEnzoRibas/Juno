CREATE SCHEMA juno_runtime;
--> statement-breakpoint
CREATE TABLE juno_runtime.schema_version (
  version integer PRIMARY KEY CHECK (version > 0)
);
--> statement-breakpoint
INSERT INTO juno_runtime.schema_version (version) VALUES (1);
--> statement-breakpoint
GRANT USAGE ON SCHEMA juno_runtime TO juno_app;
--> statement-breakpoint
GRANT SELECT ON juno_runtime.schema_version TO juno_app;
