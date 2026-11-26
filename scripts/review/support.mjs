import { spawnSync } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { createServer } from 'node:net';

const flags = new Set(['--pr', '--sha', '--web-port', '--api-port']);

export function parseArguments(args) {
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const flag = args[i];
    if (!flags.has(flag) || !args[i + 1] || Object.hasOwn(options, flag)) {
      throw new Error('Use --pr NUMBER with optional --sha SHA, --web-port PORT and --api-port PORT.');
    }
    options[flag] = args[i + 1];
  }
  const pr = options['--pr'];
  const sha = options['--sha'];
  const webPort = options['--web-port'] && validatePort(options['--web-port']);
  const apiPort = options['--api-port'] && validatePort(options['--api-port']);
  if (!/^[1-9]\d{0,8}$/.test(pr ?? '')) throw new Error('Supply a valid GitHub pull request number using --pr.');
  if (sha && !/^[a-f0-9]{40}$/.test(sha)) throw new Error('Use the exact 40-character lowercase commit SHA.');
  if (webPort && webPort === apiPort) throw new Error('The web and API must use different ports.');
  return { pr, sha, webPort, apiPort };
}

function validatePort(value) {
  if (!/^\d{4,5}$/.test(value) || Number(value) < 1024 || Number(value) > 65535) {
    throw new Error('Review ports must be between 1024 and 65535.');
  }
  return Number(value);
}

async function openLoopback(port) {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen({ port: port ?? 0, host: '127.0.0.1', exclusive: true }, resolve);
  }).catch(error => {
    throw new Error(`Loopback port ${port ?? '(automatic)'} could not be reserved: ${error.code ?? error.message}`);
  });
  return server;
}

export async function choosePorts(webPort, apiPort) {
  const servers = [];
  try {
    const requested = [webPort, apiPort];
    // Reserve explicit choices before picking dynamic ports.
    for (const index of requested[1] && !requested[0] ? [1, 0] : [0, 1]) {
      servers[index] = await openLoopback(requested[index]);
    }
    return { webPort: servers[0].address().port, apiPort: servers[1].address().port };
  } finally {
    await Promise.all(servers.filter(Boolean).map(server => new Promise(resolve => server.close(resolve))));
  }
}

export function run(name, executable, args, { cwd, env, input, capture = false, quiet = false } = {}) {
  const result = spawnSync(executable, args, {
    cwd, env, input, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024,
    stdio: [input === undefined ? 'ignore' : 'pipe', capture ? 'pipe' : 'inherit', quiet ? 'pipe' : 'inherit'],
  });
  if (result.error || result.status !== 0) {
    throw new Error(`${name} failed (${result.error?.code ?? result.signal ?? result.status})`);
  }
  return result.stdout ?? '';
}

export function parseJsonLines(output) {
  const text = output.trim();
  if (!text) return [];
  return text.startsWith('[') ? JSON.parse(text) : text.split(/\r?\n/).map(line => JSON.parse(line));
}

export function assertPublishedPorts(config, state) {
  const services = config.services ?? {};
  if (!config.networks?.database?.internal || Object.values(config.volumes ?? {}).some(volume => volume.external || volume.driver_opts)) {
    throw new Error('The review requires the default private database network and project-scoped volumes.');
  }
  for (const [name, service] of Object.entries(services)) {
    const ports = service.ports ?? [];
    const expected = name === 'web' ? state.webPort : name === 'api' ? state.apiPort : undefined;
    if (ports.length !== (expected ? 1 : 0)
      || (expected && (ports[0].host_ip !== '127.0.0.1' || Number(ports[0].published) !== expected))) {
      throw new Error(`Unexpected host port mapping for the ${name} review service.`);
    }
    if ((service.volumes ?? []).some(volume => volume.type !== 'volume')
      || service.privileged || service.network_mode || service.container_name) {
      throw new Error(`Unexpected host dependency for the ${name} review service.`);
    }
  }
  if (!services.web || !services.api || !services.db || !services.migrate
    || Object.values(config.networks ?? {}).some(network => network.external || !network.name?.startsWith(state.project + '_'))
    || Object.values(config.volumes ?? {}).some(volume => !volume.name?.startsWith(state.project + '_'))) {
    throw new Error('The Compose topology does not support an isolated review.');
  }
  if (services.web.environment?.JUNO_API_ORIGIN !== 'http://api:3001') {
    throw new Error('The review frontend must use the API service in its own Compose project.');
  }
  for (const name of ['web', 'api', 'migrate']) {
    if (services[name].image !== `juno-runtime:${state.project}` || !services[name].build) {
      throw new Error(`The ${name} service must build and use the unique review image.`);
    }
  }
}

export function secret() {
  return randomBytes(32).toString('hex');
}
