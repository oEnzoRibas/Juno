import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { once } from 'node:events';
import { mkdtempSync, readFileSync, rmdirSync, rmSync } from 'node:fs';
import { request as httpRequest } from 'node:http';
import { createServer } from 'node:https';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { chromium, expect } from '@playwright/test';

const password = () => randomBytes(32).toString('hex');
const runId = randomUUID();
const image = 'juno-runtime:juno-production-qa-' + runId;
const host = '127.0.0.1';
const ports = [process.env.JUNO_QA_SOURCE_PORT ?? '18612', process.env.JUNO_QA_RESTORE_PORT ?? '18613'];
assert.notEqual(ports[0], ports[1]);
for (const port of ports) {
  assert.match(port, /^\d{4,5}$/);
  assert.ok(Number(port) >= 1024 && Number(port) <= 65535, 'Expected an unprivileged TCP port');
}
const maintainer = { email: 'platform@example.invalid', password: password() };
const administrator = { email: 'atlas-admin@example.invalid', password: password() };
const journal = 'SELECT id, hash, created_at FROM drizzle.__drizzle_migrations ORDER BY id';

function command(description, executable, args, { env, input, capture = false } = {}) {
  const result = spawnSync(executable, args, {
    env, input, timeout: 300_000, maxBuffer: 16 * 1024 * 1024,
    stdio: [input === undefined ? 'ignore' : 'pipe', capture ? 'pipe' : 'inherit', 'inherit'],
  });
  if (result.status !== 0) {
    throw new Error(description + ' failed: ' + (result.error?.code ?? result.signal ?? result.status));
  }
  return result.stdout;
}

function installation(label, port) {
  const project = 'juno-production-' + label + '-' + runId;
  const env = {
    ...process.env,
    COMPOSE_PROJECT_NAME: project,
    COMPOSE_PROFILES: '',
    JUNO_RUNTIME_IMAGE: image,
    JUNO_WEB_PORT: port,
    JUNO_DATABASE_PASSWORD: password(),
    JUNO_MIGRATION_PASSWORD: password(),
  };
  const prefix = ['compose', '-p', project, '--env-file', 'docs/deployment/production.env.example', '-f', 'compose.production.yaml'];
  function compose(args, options) {
    return command(project + ' ' + args[0], 'docker', [...prefix, ...args], { ...options, env });
  }
  function database(args, options) {
    return compose(['exec', '-T', 'db', ...args], options);
  }
  function inspect() {
    const config = JSON.parse(compose(['config', '--format', 'json'], { capture: true }));
    assert.equal(config.networks.database.internal, true);
    assert.equal(config.services.db.ports?.length ?? 0, 0);
    assert.equal(config.services.api.ports?.length ?? 0, 0);
    assert.equal(config.services.web.ports.length, 1);
    assert.equal(config.services.web.ports[0].host_ip, host);
    assert.equal(config.services.web.environment.JUNO_ALLOW_INSECURE_LOCAL_COOKIE, undefined);
    assert.equal(config.services.api.depends_on.migrate.condition, 'service_completed_successfully');
    assert.equal(config.services.web.depends_on.api.condition, 'service_healthy');
  }
  function api(path, options, expected = 200) {
    const input = {
      path,
      expected,
      method: options?.method ?? 'GET',
      token: options?.token,
      body: options?.body,
    };
    const program = `
      const {path, expected, method, token, body} = JSON.parse(require('node:fs').readFileSync(0));
      const headers = body === undefined ? {} : {'content-type': 'application/json'};
      if (token) headers.authorization = 'Bearer ' + token;
      fetch('http://127.0.0.1:3001/api' + path, {
        method, headers, body: JSON.stringify(body), signal: AbortSignal.timeout(10000),
      }).then(async response => {
        if (response.status !== expected) throw new Error('expected ' + expected + ', received ' + response.status);
        process.stdout.write(await response.text());
      }).catch(error => { console.error(error.message); process.exitCode = 1; });
    `;
    const output = compose(['exec', '-T', 'api', 'node', '-e', program], { input: JSON.stringify(input), capture: true });
    if (expected < 400 && output.length) return JSON.parse(output);
  }
  return {
    port,
    inspect,
    build: () => compose(['build', 'migrate']),
    start: () => compose(['up', '--no-build', '--pull', 'never', '--wait', '--wait-timeout', '120']),
    stop: () => compose(['down']),
    acquireDatabaseImage: () => compose(['pull', '--policy', 'missing', 'db']),
    stopApplications: () => compose(['stop', 'web', 'api']),
    cleanup: () => compose(['down', '--volumes', '--remove-orphans']),
    query: (sql) => database(['psql', '-U', 'juno_migrator', '-d', 'juno', '-At', '-v', 'ON_ERROR_STOP=1', '-c', sql], { capture: true }).toString().trim(),
    bootstrap: (account) => compose(['run', '--rm', '-T', '--no-deps', 'migrate', 'node', 'dist/auth/bootstrap-admin.js'], { input: JSON.stringify(account) }),
    api,
    login: (credentials) => api('/auth/sign-in', { method: 'POST', body: credentials }).token,
    dump: () => database(['pg_dump', '-U', 'juno_migrator', '-d', 'juno', '--format=custom'], { capture: true }),
    restore: (input) => database(['pg_restore', '-U', 'juno_migrator', '-d', 'juno', '--clean', '--if-exists', '--single-transaction', '--exit-on-error'], { input }),
    migrate: () => compose(['run', '--rm', '-T', 'migrate']),
  };
}

async function verifyHttps(installation, browser, tls) {
  const proxy = createServer(tls, (request, response) => {
    const outgoing = httpRequest({
      hostname: host,
      port: installation.port,
      path: request.url,
      method: request.method,
      headers: { ...request.headers, 'x-forwarded-host': request.headers.host, 'x-forwarded-proto': 'https' },
    }, (upstream) => {
      response.writeHead(upstream.statusCode, upstream.headers);
      upstream.pipe(response);
    });
    outgoing.on('error', () => response.writeHead(502).end());
    request.pipe(outgoing);
  });
  proxy.listen(0, host);
  await once(proxy, 'listening');
  const origin = 'https://' + host + ':' + proxy.address().port;
  try {
    const context = await browser.newContext({ ignoreHTTPSErrors: true });
    try {
      const page = await context.newPage();
      await page.goto(origin + '/sign-in?lang=pt-BR');
      await page.getByLabel('E-mail', { exact: true }).fill(administrator.email);
      await page.getByLabel('Senha', { exact: true }).fill(administrator.password);
      await page.getByRole('button', { name: 'Entrar' }).click();
      await expect(page).toHaveURL(/\/session\?lang=pt-BR$/);
      const cookie = (await context.cookies(origin)).find(({ name }) => name === '__Host-juno_session');
      assert.ok(cookie, 'Expected a host-prefixed session cookie');
      assert.deepEqual([cookie.secure, cookie.httpOnly, cookie.sameSite, cookie.path], [true, true, 'Strict', '/']);
      await page.getByRole('link', { name: 'Qualification Atlas', exact: true }).click();
      await expect(page.getByRole('heading', { name: 'Qualification Atlas' })).toBeVisible();
    } finally {
      await context.close();
    }
  } finally {
    await new Promise((resolve, reject) => proxy.close((error) => error ? reject(error) : resolve()));
  }
}

function verifyTenants(installation, own, foreign) {
  const token = installation.login(administrator);
  assert.deepEqual(installation.api('/tenants', { token }).map(({ id }) => id), [own.id]);
  installation.api('/tenants/' + foreign.id, { token }, 404);
  installation.api('/tenants/' + foreign.id + '/invitations', {
    method: 'POST', token, body: { role: 'member', email: 'denied@example.invalid' },
  }, 403);
}

const source = installation('source', ports[0]);
const destination = installation('restore', ports[1]);
const certificates = mkdtempSync(join(tmpdir(), 'juno-production-qa-'));
let browser;
let startedSource = false;
let startedDestination = false;
try {
  const key = join(certificates, 'key.pem');
  const cert = join(certificates, 'cert.pem');
  command('Generate disposable TLS certificate', process.env.JUNO_QA_OPENSSL ?? 'openssl', [
    'req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '1', '-subj', '/CN=127.0.0.1',
    '-addext', 'subjectAltName=IP:127.0.0.1', '-keyout', key, '-out', cert,
  ]);
  const tls = { key: readFileSync(key), cert: readFileSync(cert) };
  browser = await chromium.launch();
  source.inspect();
  destination.inspect();
  startedSource = true;
  source.acquireDatabaseImage();
  source.build();
  source.start();
  const runtimeUser = command('Inspect runtime image user', 'docker', ['image', 'inspect', '--format', '{{.Config.User}}', image], { capture: true });
  assert.equal(runtimeUser.toString().trim(), 'node');
  assert.deepEqual(source.api('/health'), { status: 'ok' });
  assert.deepEqual(source.api('/ready'), { status: 'ready' });
  source.bootstrap(maintainer);
  const platform = source.login(maintainer);
  const createTenant = (slug, name) => source.api('/tenants', {
    method: 'POST', token: platform, body: { slug, name, accent: '#5543CF' },
  }, 201);
  const own = createTenant('qualification-atlas', 'Qualification Atlas');
  const foreign = createTenant('qualification-mare', 'Qualification Mare');
  const invite = source.api('/tenants/' + own.id + '/invitations', {
    method: 'POST', token: platform, body: { role: 'administrator', email: administrator.email },
  }, 201);
  source.api('/tenants/activation', {
    method: 'POST', body: { token: invite.token, password: administrator.password },
  }, 201);
  verifyTenants(source, own, foreign);
  await verifyHttps(source, browser, tls);
  const before = source.query(journal);
  assert.match(before, /\|/);
  source.stop();
  source.start();
  assert.equal(source.query(journal), before);
  verifyTenants(source, own, foreign);
  console.log('Production source passed readiness, HTTPS, secure cookies, tenant isolation and restart persistence.');

  const archive = source.dump();
  assert.equal(archive.subarray(0, 5).toString(), 'PGDMP');
  startedDestination = true;
  destination.start();
  assert.equal(destination.query('SELECT count(*) FROM juno.tenant'), '0');
  destination.stopApplications();
  destination.restore(archive);
  destination.migrate();
  destination.start();
  assert.equal(destination.query(journal), before);
  assert.equal(destination.query('SELECT count(*) FROM juno.tenant'), '2');
  assert.deepEqual(destination.api('/ready'), { status: 'ready' });
  verifyTenants(destination, own, foreign);
  await verifyHttps(destination, browser, tls);
  assert.equal(source.query('SELECT count(*) FROM juno.tenant'), '2');
  console.log('Production restore passed journal preservation, HTTPS, restored sign-in and tenant boundaries.');
} finally {
  const errors = [];
  const actions = [
    () => browser?.close(),
    () => startedDestination && destination.cleanup(),
    () => startedSource && source.cleanup(),
    () => {
      if (!startedSource) return;
      const tags = command('Find QA image tag', 'docker', ['image', 'ls', '--filter', 'reference=' + image, '--format', '{{.Repository}}:{{.Tag}}'], { capture: true });
      if (tags.toString().trim() === image) command('Remove QA image tag', 'docker', ['image', 'rm', image]);
    },
    () => {
      rmSync(join(certificates, 'key.pem'), { force: true });
      rmSync(join(certificates, 'cert.pem'), { force: true });
      rmdirSync(certificates);
    },
  ];
  for (const cleanup of actions) {
    try {
      await cleanup();
    } catch (error) {
      errors.push(error);
    }
  }
  if (errors.length) throw new AggregateError(errors, 'Production QA cleanup failed');
}
