import assert from 'node:assert/strict';

const api = new URL(process.env.JUNO_SMOKE_API ?? 'http://127.0.0.1:3001');
const web = new URL(process.env.JUNO_SMOKE_WEB ?? 'http://127.0.0.1:3000');

async function get(path, origin = api) {
  const result = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(5000) });
  assert.equal(result.status, 200, `Unexpected HTTP response for ${path}`);
  return result;
}

assert.deepEqual(await (await get('/api/health')).json(), { status: 'ok' });
assert.deepEqual(await (await get('/api/ready')).json(), { status: 'ready' });
const openapi = await (await get('/api/openapi.json')).json();
assert.ok(openapi.paths['/api/health'].get);
assert.ok(openapi.paths['/api/ready'].get);
assert.match(await (await get('/', web)).text(), /Workspace setup/);
assert.match(await (await get('/?lang=pt-BR', web)).text(), /Configuração do espaço de trabalho/);
console.info('Web locales, API liveness, database readiness and OpenAPI passed.');
