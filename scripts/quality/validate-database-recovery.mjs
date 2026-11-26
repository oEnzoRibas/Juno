import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const project = `juno-recovery-${randomUUID()}`;
const image = `juno-runtime:${project}`;

function port(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  assert.ok(Number.isInteger(value) && value >= 1024 && value <= 65535, `${name} must be a port from 1024 to 65535`);
  return String(value);
}

function docker(args, { env, capture = false } = {}) {
  return execFileSync('docker', args, {
    cwd: root,
    env,
    encoding: 'utf8',
    stdio: ['ignore', capture ? 'pipe' : 'inherit', 'inherit'],
  });
}

async function waitForStatus(url, status) {
  const deadline = Date.now() + 30_000;
  do {
    const response = await fetch(url, { signal: AbortSignal.timeout(5_000) }).catch(() => undefined);
    if (response?.status === status) return response;
    await response?.body?.cancel();
    await delay(500);
  } while (Date.now() < deadline);
  throw new Error(`Expected HTTP ${status} from ${url.pathname}`);
}

async function validate() {
  const webPort = port('JUNO_WEB_PORT', 18510);
  const apiPort = port('JUNO_API_PORT', 18511);
  assert.notEqual(webPort, apiPort, 'Use distinct web and API ports');

  const env = {
    ...process.env,
    COMPOSE_PROJECT_NAME: project,
    COMPOSE_PROFILES: '',
    JUNO_WEB_PORT: webPort,
    JUNO_API_PORT: apiPort,
    JUNO_MIGRATION_PASSWORD: randomBytes(32).toString('hex'),
    JUNO_DATABASE_PASSWORD: randomBytes(32).toString('hex'),
  };
  const options = ['compose', '-p', project, '--env-file', '.env.example', '-f', 'compose.yaml'];
  const compose = (args, capture = false) => docker([...options, ...args], { env, capture });
  const query = (sql) =>
    compose(
      ['exec', '-T', 'db', 'psql', '-U', 'juno_migrator', '-d', 'juno', '-Atv', 'ON_ERROR_STOP=1', '-c', sql],
      true,
    ).trim();
  const schema = () =>
    query(
      'SELECT (SELECT max(version) FROM juno_runtime.schema_version), (SELECT count(*) FROM drizzle.__drizzle_migrations)',
    );
  const marker = "SELECT count(*) FROM juno.account WHERE email = 'recovery-fixture@example.invalid'";
  const ready = new URL(`http://127.0.0.1:${apiPort}/api/ready`);
  const health = new URL('/api/health', ready);

  compose(['config', '--quiet']);
  console.info(`Start disposable recovery project ${project}`);
  try {
    compose(['up', '--build', '--wait', '--wait-timeout', '120']);
    const apiId = compose(['ps', '-q', 'api'], true).trim();
    assert.ok(apiId, 'Expected a running API container');
    await waitForStatus(ready, 200);
    const originalSchema = schema();
    assert.match(originalSchema, /^[1-9]\d*\|[1-9]\d*$/);
    query("INSERT INTO juno.account (email) VALUES ('recovery-fixture@example.invalid')");
    query("BEGIN; INSERT INTO juno.account (email) VALUES ('recovery-rollback@example.invalid'); ROLLBACK");
    assert.equal(query(marker), '1');
    console.info(`Baseline schema and migration count: ${originalSchema}`);

    compose(['stop', '--timeout', '10', 'db']);
    const unavailable = await waitForStatus(ready, 503);
    assert.deepEqual(await unavailable.json(), { message: 'Service Unavailable', statusCode: 503 });
    assert.deepEqual(await (await waitForStatus(health, 200)).json(), { status: 'ok' });
    console.info('Database outage: readiness 503, liveness 200, generic error response.');

    compose(['start', 'db']);
    await waitForStatus(ready, 200);
    assert.equal(compose(['ps', '-q', 'api'], true).trim(), apiId, 'The original API container must recover');
    assert.equal(query(marker), '1', 'The committed fixture must survive restart');
    assert.equal(query("SELECT count(*) FROM juno.account WHERE email = 'recovery-rollback@example.invalid'"), '0');
    assert.equal(schema(), originalSchema, 'Restart must preserve schema and migration history');
    compose(['run', '--rm', '-T', 'migrate']);
    assert.equal(schema(), originalSchema, 'Migration rerun must preserve the applied migration count');
    console.info(
      'Readiness recovered on the original API container. Migration history and committed data persisted, and rolled-back data stayed absent.',
    );
  } finally {
    console.info(`Remove disposable recovery project ${project}`);
    compose(['down', '--volumes', '--remove-orphans']);
    const tagged = docker(['image', 'ls', '--format', '{{.Repository}}:{{.Tag}}', '--filter', `reference=${image}`], {
      capture: true,
    });
    if (tagged.trim() === image) docker(['image', 'rm', image]);
  }
}

try {
  await validate();
} catch (error) {
  console.error(error instanceof Error ? error.message : 'Database recovery validation failed');
  process.exitCode = 1;
}
