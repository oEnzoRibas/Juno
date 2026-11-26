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
const { paths, components } = openapi;
assert.equal(components.securitySchemes.bearer.bearerFormat, 'opaque');
const jsonSchema = (content) => content['application/json'].schema;
const modelRef = (model) => ({ $ref: `#/components/schemas/${model}` });
const signIn = paths['/api/auth/sign-in'].post;
assert.deepEqual(jsonSchema(signIn.requestBody.content), modelRef('SignInBody'));
assert.deepEqual(jsonSchema(signIn.responses['200'].content), modelRef('SignInResponse'));
assert.deepEqual(paths['/api/auth/session'].get.security, [{ bearer: [] }]);
assert.deepEqual(paths['/api/auth/sign-out'].post.security, [{ bearer: [] }, {}]);
const provision = paths['/api/tenants'].post;
assert.deepEqual(jsonSchema(provision.requestBody.content), modelRef('ProvisionWorkspaceBody'));
assert.deepEqual(jsonSchema(provision.responses['201'].content), modelRef('WorkspaceIdResponse'));
assert.ok(provision.responses['403']);
const list = paths['/api/tenants'].get;
assert.deepEqual(jsonSchema(list.responses['200'].content), { type: 'array', items: modelRef('WorkspaceSummary') });
const workspace = paths['/api/tenants/{id}'].get;
assert.deepEqual(workspace.security, [{ bearer: [] }]);
assert.equal(workspace.parameters.find(({ name }) => name === 'id').schema.format, 'uuid');
assert.ok(workspace.responses['404']);
const invitation = paths['/api/tenants/{id}/invitations'].post;
assert.deepEqual(jsonSchema(invitation.requestBody.content), modelRef('IssueInvitationBody'));
assert.deepEqual(jsonSchema(invitation.responses['201'].content), modelRef('InvitationResponse'));
assert.deepEqual(components.schemas.MembershipRole.enum, ['administrator', 'member']);
const activation = paths['/api/tenants/activation'].post;
assert.deepEqual(activation.security, [{ bearer: [] }, {}]);
assert.deepEqual(components.schemas.ActivateInvitationBody.required, ['token']);
assert.ok(activation.responses['429']);
assert.match(await (await get('/', web)).text(), /Workspace setup/);
assert.match(await (await get('/?lang=pt-BR', web)).text(), /Configuração do espaço de trabalho/);
console.info('Web locales, API liveness, database readiness and OpenAPI passed.');
