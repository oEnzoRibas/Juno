import { spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const require = createRequire(import.meta.url);
const project = `juno-qa-${randomUUID()}`;

function port(name, fallback) {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isInteger(value) || value < 1024 || value > 65535) {
    throw new Error(`${name} must be an integer between 1024 and 65535`);
  }
  return String(value);
}

function run(description, executable, args, options = {}) {
  console.info(`\n${description}`);
  const result = spawnSync(executable, args, {
    cwd: root,
    env: options.env,
    input: options.input,
    encoding: 'utf8',
    stdio: [options.input === undefined ? 'ignore' : 'pipe', options.capture ? 'pipe' : 'inherit', 'inherit'],
  });
  if (result.error) throw new Error(`${description} could not start: ${result.error.code ?? 'unknown error'}`);
  if (result.status !== 0) throw new Error(`${description} failed (${result.signal ?? result.status})`);
  return result.stdout;
}

try {
  const webPort = port('JUNO_WEB_PORT', 18500);
  const apiPort = port('JUNO_API_PORT', 18501);
  if (webPort === apiPort) throw new Error('JUNO_WEB_PORT and JUNO_API_PORT must be different');

  const playwright = require.resolve('@playwright/test/cli');
  const composeEnv = {
    ...process.env,
    COMPOSE_PROJECT_NAME: project,
    COMPOSE_PROFILES: '',
    COMPOSE_ANSI: 'never',
    JUNO_WEB_PORT: webPort,
    JUNO_API_PORT: apiPort,
    JUNO_MIGRATION_PASSWORD: randomBytes(32).toString('hex'),
    JUNO_DATABASE_PASSWORD: randomBytes(32).toString('hex'),
  };
  const admin = { email: `qa-${project}@example.invalid`, password: randomBytes(32).toString('hex') };
  const smokeEnv = {
    ...process.env,
    JUNO_SMOKE_WEB: `http://127.0.0.1:${webPort}`,
    JUNO_SMOKE_API: `http://127.0.0.1:${apiPort}`,
  };
  const image = `juno-runtime:${project}`;
  // The example file replaces the contributor's .env. Process values take precedence.
  const composeArgs = ['compose', '--project-name', project, '--env-file', '.env.example', '-f', 'compose.yaml'];

  function compose(description, args, options = {}) {
    return run(description, 'docker', [...composeArgs, ...args], { ...options, env: composeEnv });
  }

  const config = JSON.parse(compose('Validate the resolved Compose configuration', [
    'config', '--format', 'json',
  ], { capture: true }));
  if (!config.networks.database.internal || config.services.db.ports?.length) {
    throw new Error('The database must stay on an internal network without host ports');
  }
  for (const service of ['web', 'api']) {
    const ports = config.services[service].ports;
    if (ports?.length !== 1 || ports[0].host_ip !== '127.0.0.1') {
      throw new Error(`${service} must publish only to loopback`);
    }
  }

  try {
    run('Identify the source checkout (no baked Git SHA in this image)', 'git', ['rev-parse', 'HEAD', 'HEAD^{tree}']);
    compose(`Build a single runtime image for ${project}`, ['build', 'migrate']);
    compose(`Start disposable project ${project}`, ['up', '--no-build', '--wait', '--wait-timeout', '120']);
    const imageId = run('Read the local build image identity', 'docker', ['image', 'inspect', image, '--format', '{{.Id}}'], { capture: true }).trim();
    for (const service of ['web', 'api']) {
      const container = compose(`Find ${service} in ${project}`, ['ps', '-q', service], { capture: true }).trim();
      const running = run(`Read ${service} runtime image`, 'docker', ['inspect', container, '--format', '{{.Image}}'], { capture: true }).trim();
      if (running !== imageId) throw new Error(`Unexpected running ${service} image`);
      console.info(`${service}: ${running}`);
    }
    compose('Verify the actual web-to-API connection', ['exec', '-T', 'web', 'node', '-e',
      'const o=process.env.JUNO_API_ORIGIN;fetch(new URL("/api/ready",o)).then(async r=>{const data=await r.json();if(!r.ok||data.status!=="ready")process.exit(1);console.log(`Web API readiness: ${r.status}`)}).catch(()=>process.exit(1))']);
    compose('Read the connected database schema', ['exec', '-T', 'db', 'psql', '-U', 'juno_migrator', '-d', 'juno', '-Atc',
      'SELECT max(version) FROM juno_runtime.schema_version']);
    run('Verify web locales, API health and OpenAPI', process.execPath, ['scripts/runtime-smoke.mjs'], { env: smokeEnv });

    const journalQuery = [
      'exec', '-T', 'db', 'psql', '-U', 'juno_migrator', '-d', 'juno', '-At',
      '-c', 'SELECT count(*) FROM drizzle.__drizzle_migrations',
    ];
    const before = Number(compose('Read the migration journal', journalQuery, { capture: true }).trim());
    if (!Number.isSafeInteger(before) || before < 1) throw new Error('No applied migrations were recorded');
    compose('Rerun the one-shot migration', ['run', '--rm', '-T', 'migrate']);
    const after = Number(compose('Verify the migration journal is unchanged', journalQuery, { capture: true }).trim());
    if (after !== before) throw new Error('Rerunning migrations changed the migration journal');

    for (const sql of ['tenant-isolation.sql', 'invitation-expiry.sql', 'onboarding-audit.sql', 'member-directory.sql']) {
      compose(`Run database regression ${sql}`, [
        'exec', '-T', 'db', 'psql', '-U', 'juno_migrator', '-d', 'juno', '-v', 'ON_ERROR_STOP=1',
      ], { input: readFileSync(join(root, 'apps/api/drizzle/test', sql)) });
    }

    compose('Bootstrap a synthetic platform administrator', [
      'run', '--rm', '-T', 'migrate', 'pnpm', '--filter', '@juno/api', 'bootstrap-admin',
    ], { input: JSON.stringify(admin) });
    run('Run Playwright and save the structured review report', process.execPath, [
      playwright, 'test', '--workers=1',
    ], { env: {
      ...smokeEnv,
      JUNO_TEST_ADMIN_EMAIL: admin.email,
      JUNO_TEST_ADMIN_PASSWORD: admin.password,
    } });
  } finally {
    try {
      compose(`Remove disposable project ${project}`, ['down', '--volumes', '--remove-orphans']);
      const tags = run('Check for the disposable runtime image', 'docker', [
        'image', 'ls', '--filter', `reference=${image}`, '--format', '{{.Repository}}:{{.Tag}}',
      ], { capture: true });
      if (tags.trim() === image) {
        run('Remove the disposable runtime image tag', 'docker', ['image', 'rm', image]);
      }
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
