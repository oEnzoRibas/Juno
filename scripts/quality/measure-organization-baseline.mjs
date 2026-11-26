import { spawnSync } from 'node:child_process';
import { randomBytes, randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';

const revision = '23934aca652cb00423900374f410d516bbf74a4e';
const ports = { web: '18604', api: '18605' };
const project = 'juno-org-baseline-' + randomUUID();
const image = 'juno-runtime:' + project;
const environment = {
  ...process.env,
  COMPOSE_PROJECT_NAME: project,
  COMPOSE_PROFILES: '',
  JUNO_WEB_PORT: ports.web,
  JUNO_API_PORT: ports.api,
  JUNO_MIGRATION_PASSWORD: randomBytes(32).toString('hex'),
  JUNO_DATABASE_PASSWORD: randomBytes(32).toString('hex'),
};

function run(command, args, { input, env = process.env, stream = false } = {}) {
  const result = spawnSync(command, args, {
    input, env, encoding: 'utf8', timeout: 300_000,
    stdio: [input === undefined ? 'ignore' : 'pipe', stream ? 'inherit' : 'pipe', 'inherit'],
  });
  if (result.status !== 0) {
    throw new Error(command + ' ' + args[0] + ' failed: ' + (result.error?.code ?? result.status));
  }
  return result.stdout?.trim();
}

function compose(args, options = {}) {
  return run('docker', ['compose', '-p', project, '--env-file', '.env.example', '-f', 'compose.yaml', ...args],
    { ...options, env: environment });
}

async function request(path, { method = 'GET', token, body, expected = 200 } = {}) {
  const headers = body === undefined ? {} : { 'content-type': 'application/json' };
  if (token) headers.authorization = 'Bearer ' + token;
  const start = performance.now();
  const response = await fetch('http://127.0.0.1:' + ports.api + '/api' + path, {
    method, headers, body: JSON.stringify(body), signal: AbortSignal.timeout(10_000),
  });
  if (response.status !== expected) {
    throw new Error(method + ' expected status ' + expected + ', received ' + response.status);
  }
  const data = await response.json();
  return { data, milliseconds: performance.now() - start };
}

function describe(label, values) {
  const sorted = [...values].sort((left, right) => left - right);
  const percentile = (fraction) => +sorted[Math.ceil(sorted.length * fraction) - 1].toFixed(2);
  console.log(JSON.stringify({ label, n: sorted.length, p50Ms: percentile(0.5), p95Ms: percentile(0.95), maxMs: percentile(1) }));
}

async function measure(label, operation) {
  for (let attempt = 0; attempt < 5; attempt++) await operation();
  const times = [];
  for (let attempt = 0; attempt < 30; attempt++) times.push((await operation()).milliseconds);
  describe(label, times);
}

if (run('git', ['rev-parse', 'HEAD']) !== revision || run('git', ['status', '--porcelain'])) {
  throw new Error('Run from a clean disposable checkout at ' + revision);
}

console.log(JSON.stringify({ revision, project, ports, node: process.version }));
try {
  compose(['build'], { stream: true });
  const start = performance.now();
  compose(['up', '--no-build', '--wait', '--wait-timeout', '120'], { stream: true });
  console.log(JSON.stringify({ cachedStartupMs: +((performance.now() - start).toFixed(2)),
    imageBytes: Number(run('docker', ['image', 'inspect', '--format', '{{.Size}}', image])),
    imageUser: run('docker', ['image', 'inspect', '--format', '{{.Config.User}}', image]) }));

  const password = () => randomBytes(32).toString('hex');
  const platform = { email: 'baseline-platform@example.invalid', password: password() };
  compose(['run', '--rm', '-T', 'migrate', 'pnpm', '--filter', '@juno/api', 'bootstrap-admin'],
    { input: JSON.stringify(platform), stream: true });
  const signIn = async (credentials) =>
    (await request('/auth/sign-in', { method: 'POST', body: credentials })).data.token;
  const platformToken = await signIn(platform);
  const createTenant = async (slug) => (await request('/tenants', {
    method: 'POST', token: platformToken, body: { slug, name: slug, accent: '#7565F5' }, expected: 201,
  })).data.id;
  const tenant = await createTenant('baseline-atlas');
  const foreignTenant = await createTenant('baseline-mare');
  const admin = { email: 'baseline-atlas-admin@example.invalid', password: password() };
  const invitation = await request('/tenants/' + tenant + '/invitations', {
    method: 'POST', token: platformToken, body: { email: admin.email, role: 'administrator' }, expected: 201,
  });
  await request('/tenants/activation', {
    method: 'POST', body: { token: invitation.data.token, password: admin.password }, expected: 201,
  });
  const token = await signIn(admin);

  const postgres = (input) => compose([
    'exec', '-T', 'db', 'psql', '-U', 'juno_migrator', '-d', 'juno', '-v', 'ON_ERROR_STOP=1', '-At',
  ], { input });
  const seed = (tenantId, prefix, count) => `
    WITH accounts AS (
      INSERT INTO juno.account (id, email)
      SELECT gen_random_uuid(), '${prefix}-' || lpad(n::text, 4, '0') || '@example.invalid'
      FROM generate_series(1, ${count}) AS n RETURNING id, email
    )
    INSERT INTO juno.membership (tenant_id, account_id, role, active)
    SELECT '${tenantId}', id, 'member', right(split_part(email, '@', 1), 1) <> '0' FROM accounts;
  `;
  postgres(seed(tenant, 'atlas', 600) + seed(foreignTenant, 'mare', 200) +
    'ANALYZE juno.account; ANALYZE juno.membership;');

  const members = '/tenants/' + tenant + '/members';
  const firstPage = await request(members, { token });
  if (firstPage.data.items.length !== 50 || !firstPage.data.nextCursor) throw new Error('Expected a full first page');
  const nextPage = members + '?after=' + firstPage.data.nextCursor;
  const filtered = members + '?emailPrefix=ATLAS-00&role=member&active=false';
  const filteredPage = await request(filtered, { token });
  if (filteredPage.data.items.length !== 9) throw new Error('Filtered synthetic result count differs');
  await measure('readiness', () => request('/ready'));
  await measure('directory first page', () => request(members, { token }));
  await measure('directory cursor page', () => request(nextPage, { token }));
  await measure('directory filtered prefix', () => request(filtered, { token }));

  const profile = '/tenants/' + tenant + '/profile';
  const concurrent = [];
  for (let batch = 0; batch < 8; batch++) {
    const pair = await Promise.all([1, 2].map(() => request(profile, {
      method: 'PUT', token, body: { name: 'Baseline Atlas ' + batch, accent: '#AABBCC' },
    })));
    if (pair.some(({ data }) => data.name !== 'Baseline Atlas ' + batch)) throw new Error('Profile result differs');
    concurrent.push(...pair.map(({ milliseconds }) => milliseconds));
  }
  describe('profile PUT, two concurrent requests', concurrent);

  console.log(postgres(`
    BEGIN;
    SET LOCAL ROLE juno_app;
    SELECT set_config('juno.tenant_id', '${tenant}', true);
    RESET ROLE;
    SELECT set_config('juno.account_id', id::text, true) FROM juno.account WHERE email = 'baseline-atlas-admin@example.invalid';
    SET LOCAL ROLE juno_app;
    EXPLAIN (ANALYZE, BUFFERS, COSTS OFF, SUMMARY ON)
      SELECT juno.search_member_directory(NULL, 'ATLAS-00', 'member', false, NULL);
    ROLLBACK;
  `).split('\n').filter((line) => /Result|Buffers|Planning|Execution/.test(line)).join('\n'));
  for (const service of ['db', 'api', 'web']) {
    const id = compose(['ps', '-q', service]);
    console.log(service, run('docker', ['stats', '--no-stream', '--format', '{{.CPUPerc}} {{.MemUsage}}', id]));
  }
} finally {
  try {
    compose(['down', '--volumes', '--remove-orphans'], { stream: true });
  } finally {
    if (run('docker', ['image', 'ls', '--filter', 'reference=' + image, '--format', '{{.Repository}}:{{.Tag}}']) === image) {
      run('docker', ['image', 'rm', image], { stream: true });
    }
  }
}
