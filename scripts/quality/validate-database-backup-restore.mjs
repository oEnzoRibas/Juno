import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const fixture = 'backup-restore-fixture@example.invalid';
const migrationState = 'SELECT max(version) FROM juno_runtime.schema_version';
const migrationJournal = 'SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id';
const accountCount = `SELECT count(*) FROM juno.account WHERE email = '${fixture}'`;

function docker(args, { env, input, capture = false } = {}) {
  return execFileSync('docker', args, {
    cwd: root,
    env,
    input,
    maxBuffer: 16 * 1024 * 1024,
    stdio: [input === undefined ? 'ignore' : 'pipe', capture ? 'pipe' : 'inherit', 'inherit'],
  });
}

function environment(label) {
  const project = `juno-backup-${label}-${randomUUID()}`;
  const image = `juno-runtime:${project}`;
  const env = {
    ...process.env,
    COMPOSE_PROJECT_NAME: project,
    COMPOSE_PROFILES: '',
    JUNO_MIGRATION_PASSWORD: randomBytes(32).toString('hex'),
    JUNO_DATABASE_PASSWORD: randomBytes(32).toString('hex'),
  };
  const args = ['compose', '-p', project, '--env-file', '.env.example', '-f', 'compose.yaml'];
  const compose = (command, options) => docker([...args, ...command], { ...options, env });
  const database = (command, options) => compose(['exec', '-T', 'db', ...command], options);

  return {
    start() {
      console.info(`Start disposable PostgreSQL project ${project}`);
      compose(['config', '--quiet']);
      compose(['up', '--wait', '--wait-timeout', '60', 'db']);
      compose(['run', '--build', '--rm', '-T', 'migrate']);
    },
    query(sql) {
      return database(['psql', '-q', '-U', 'juno_migrator', '-d', 'juno', '-Atv', 'ON_ERROR_STOP=1', '-c', sql], {
        capture: true,
      })
        .toString('utf8')
        .trim()
        .replaceAll('\r\n', '\n');
    },
    dump() {
      return database(['pg_dump', '-U', 'juno_migrator', '-d', 'juno', '--format=custom'], { capture: true });
    },
    restore(archive) {
      const listing = database(['pg_restore', '--list'], { input: archive, capture: true });
      assert.match(listing.toString('utf8'), /TABLE DATA juno account/);
      database(
        [
          'pg_restore',
          '-U',
          'juno_migrator',
          '-d',
          'juno',
          '--clean',
          '--if-exists',
          '--exit-on-error',
          '--single-transaction',
        ],
        { input: archive },
      );
    },
    verifyPolicies() {
      for (const name of ['tenant-isolation.sql', 'onboarding-audit.sql']) {
        database(['psql', '-U', 'juno_migrator', '-d', 'juno', '-v', 'ON_ERROR_STOP=1'], {
          input: readFileSync(new URL(`../../apps/api/drizzle/test/${name}`, import.meta.url)),
        });
      }
    },
    cleanup() {
      compose(['down', '--volumes', '--remove-orphans']);
      const tags = docker(['image', 'ls', '--filter', `reference=${image}`, '--format', '{{.Repository}}:{{.Tag}}'], {
        capture: true,
      });
      if (tags.toString('utf8').trim() === image) docker(['image', 'rm', image]);
    },
  };
}

const source = environment('source');
const destination = environment('restore');
const started = [];
try {
  started.push(source);
  source.start();
  source.query(`INSERT INTO juno.account (email) VALUES ('${fixture}')`);
  assert.equal(source.query(accountCount), '1');
  const expectedState = source.query(migrationState);
  assert.match(expectedState, /^[1-9]\d*$/);
  const expectedJournal = source.query(migrationJournal);
  assert.ok(expectedJournal, 'The source must have applied migrations');
  const archive = source.dump();

  started.push(destination);
  destination.start();
  assert.equal(destination.query(accountCount), '0', 'The target must begin without the source fixture');
  destination.restore(archive);
  assert.equal(destination.query(accountCount), '1', 'The restored target must contain the source fixture');
  assert.equal(destination.query(migrationState), expectedState, 'The schema version must match the source');
  assert.equal(destination.query(migrationJournal), expectedJournal, 'The migration journal must match the source');
  destination.verifyPolicies();
  assert.equal(source.query(accountCount), '1', 'The source must retain its original data');
  console.info('Verified the archive, restored fixture and migration journal, and retested tenant and audit policies.');
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Database backup and restore validation failed');
  process.exitCode = 1;
} finally {
  for (const project of started.reverse()) {
    try {
      project.cleanup();
    } catch (error) {
      console.error(error instanceof Error ? error.message : 'Disposable backup project cleanup failed');
      process.exitCode = 1;
    }
  }
}
