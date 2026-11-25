import { createHash, randomUUID } from 'node:crypto';
import { existsSync, lstatSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { apiRequest, seed, verifyDirectory } from './fixtures.mjs';
import { assertPublishedPorts, choosePorts, parseArguments, parseJsonLines, run, secret } from './support.mjs';

function git(args, cwd = process.cwd()) {
  return run('Git', 'git', args, { cwd, capture: true }).trim();
}

function writePrivate(path, value) {
  writeFileSync(path, value, { mode: 0o600, flag: 'wx' });
}

function repository() {
  const common = realpathSync(git(['rev-parse', '--path-format=absolute', '--git-common-dir']));
  const remote = git(['remote', 'get-url', 'origin']);
  const name = remote.match(/^(?:https:\/\/github\.com\/|git@github\.com:|ssh:\/\/git@github\.com\/)([\w.-]+\/[\w.-]+?)(?:\.git)?$/i)?.[1];
  if (!name) throw new Error('Origin must identify a repository on github.com.');
  const namespace = createHash('sha256').update(common).digest('hex').slice(0, 20);
  return { common, name, directory: join(tmpdir(), `juno-review-${namespace}`) };
}

function ensureDirectory(path, create = false) {
  if (create && !existsSync(path)) {
    try { mkdirSync(path, { mode: 0o700 }); } catch (error) {
      if (error.code !== 'EEXIST') throw error;
    }
  }
  const stat = lstatSync(path);
  if (!stat.isDirectory() || stat.isSymbolicLink() || (process.platform !== 'win32' && (stat.mode & 0o077))) {
    throw new Error('The review state directory must be private and must not be a symbolic link.');
  }
}

function readPrivate(path) {
  const stat = lstatSync(path);
  if (!stat.isFile() || stat.isSymbolicLink() || (process.platform !== 'win32' && (stat.mode & 0o077))) {
    throw new Error('Unexpected review state file or permissions.');
  }
  return readFileSync(path, 'utf8');
}

function composeEnvironment() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (/^(?:COMPOSE_|JUNO_)/i.test(key)) delete env[key];
  }
  env.COMPOSE_PROFILES = '';
  return env;
}

function compose(state, args, options = {}) {
  const envFile = join(state.directory, 'compose.env');
  readPrivate(envFile);
  return run('Docker Compose', 'docker', [
    'compose', '-p', state.project, '--env-file', envFile, '-f', 'compose.yaml', ...args,
  ], { cwd: state.source, env: composeEnvironment(), ...options });
}

function recordedState(directory, repo, pr) {
  ensureDirectory(directory);
  const state = JSON.parse(readPrivate(join(directory, 'state.json')));
  if (state.common !== repo.common || state.pr !== pr
    || state.directory !== directory || state.source !== join(directory, 'source')
    || !new RegExp(`^juno-review-pr${pr}-[a-f0-9-]{36}$`).test(state.project)
    || !/^[a-f0-9]{40}$/.test(state.sha) || !/^[a-f0-9]{40}$/.test(state.tree)) {
    throw new Error('Review state does not match this repository and PR.');
  }
  return state;
}

function ensureCheckout(state) {
  ensureDirectory(state.directory);
  if (lstatSync(state.source).isSymbolicLink() || git(['branch', '--show-current'], state.source)) {
    throw new Error('Review source must remain a detached worktree.');
  }
  const external = realpathSync(git(['rev-parse', '--path-format=absolute', '--git-common-dir'], state.source));
  if (external !== state.common || git(['rev-parse', 'HEAD'], state.source) !== state.sha
    || git(['rev-parse', 'HEAD^{tree}'], state.source) !== state.tree) {
    throw new Error('Review checkout revision or repository changed. Preserve it and inspect the state manually.');
  }
  return Boolean(git(['status', '--porcelain=v1', '--untracked-files=all'], state.source));
}

function ensureCleanCheckout(state) {
  if (ensureCheckout(state)) {
    throw new Error('Review checkout contains local edits. Preserve or remove them before retrying.');
  }
}

function disposableOutputs(state) {
  const ignored = git(['status', '--porcelain=v1', '--ignored=matching', '--untracked-files=normal'], state.source);
  const entries = ignored.split(/\r?\n/).filter(Boolean);
  if (entries.some(line => !/^!! (?:(?:apps\/(?:api|web)\/)?(?:node_modules|\.turbo|\.next|dist)\/|apps\/web\/(?:next-env\.d\.ts|tsconfig\.tsbuildinfo)|playwright-report\/|test-results\/)$/.test(line))) {
    throw new Error('Unexpected ignored files are present. Preserve the disposable checkout for inspection.');
  }
  return entries.map(line => line.slice(3));
}

function confirmOwnership(state) {
  if (dockerEngine() !== state.engine) throw new Error('Select the Docker Engine originally used by this review.');
  const ids = run('List review containers', 'docker', [
    'ps', '-aq', '--filter', `label=com.docker.compose.project=${state.project}`,
  ], { capture: true }).trim().split(/\s+/).filter(Boolean);
  for (const id of ids) {
    const labels = JSON.parse(run('Inspect Compose ownership', 'docker', [
      'inspect', '--format', '{{json .Config.Labels}}', id,
    ], { capture: true }));
    const path = labels['com.docker.compose.project.working_dir'];
    if (!path || resolve(path) !== resolve(state.source)) {
      throw new Error('A container with this review project label belongs to another working directory.');
    }
  }
}

function dockerEngine() {
  const id = run('Identify Docker Engine', 'docker', ['info', '--format', '{{.ID}}'], { capture: true }).trim();
  if (!id) throw new Error('Docker Engine did not return an identity.');
  return id;
}

function removeSource(state, disposable) {
  if (existsSync(state.source)) {
    ensureCleanCheckout(state);
    // Remove only the validated build output before Git removes the clean worktree.
    for (const relative of disposable ? disposableOutputs(state) : []) {
      rmSync(join(state.source, relative.replace(/\/$/, '')), { recursive: true, force: true, maxRetries: 3 });
    }
    git(['worktree', 'remove', state.source]);
  }
  for (const name of ['compose.env', 'credentials.json', 'state.json']) {
    const file = join(state.directory, name);
    if (existsSync(file)) unlinkSync(file);
  }
  rmdirSync(state.directory);
}

function stop(state) {
  if (!existsSync(state.source)) throw new Error('The review worktree is missing. Preserve the state for manual recovery.');
  ensureCleanCheckout(state);
  if (git(['status', '--porcelain=v1', '--ignored=matching', '--untracked-files=normal'], state.source)) {
    throw new Error('Review checkout contains ignored files. Preserve or remove them before stopping.');
  }
  confirmOwnership(state);
  compose(state, ['down', '--volumes', '--remove-orphans']);
  const image = `juno-runtime:${state.project}`;
  const tags = run('List review image', 'docker', [
    'image', 'ls', '--filter', `reference=${image}`, '--format', '{{.Repository}}:{{.Tag}}',
  ], { capture: true });
  if (tags.trim() === image) run('Remove review image tag', 'docker', ['image', 'rm', image]);
  removeSource(state, false);
}

function createCheckout(directory, repo, pr, sha, ports) {
  const prInfo = JSON.parse(run('Read pull request head', 'gh', [
    'pr', 'view', pr, '--repo', repo.name, '--json', 'headRefOid',
  ], { capture: true }));
  if (sha && prInfo.headRefOid !== sha) throw new Error('The PR head has moved. Recheck the published revision before starting.');
  const ref = `refs/juno-review/pr-${pr}-${randomUUID()}`;
  git(['fetch', '--no-tags', 'origin', `refs/pull/${pr}/head:${ref}`]);
  const head = git(['rev-parse', `${ref}^{commit}`]);
  git(['update-ref', '-d', ref, head]);
  if (head !== prInfo.headRefOid) throw new Error('The PR changed during fetch. Retry with a fresh pin.');
  const state = {
    common: repo.common, pr, directory, source: join(directory, 'source'),
    sha: head, tree: git(['rev-parse', `${head}^{tree}`]), project: `juno-review-pr${pr}-${randomUUID()}`, ...ports,
  };
  git(['worktree', 'add', '--detach', state.source, state.sha]);
  ensureCleanCheckout(state);
  console.info(`Resolved checkout ${state.sha} (tree ${state.tree})`);
  return state;
}

async function status(state) {
  const dirty = ensureCheckout(state);
  confirmOwnership(state);
  const containers = parseJsonLines(compose(state, ['ps', '--all', '--format', 'json'], { capture: true }));
  const runtime = {};
  for (const container of containers) {
    if (!['api', 'web'].includes(container.Service)) continue;
    const inspected = JSON.parse(run('Inspect runtime image', 'docker', ['inspect', '--format', '{{json .Image}}', container.ID], { capture: true }));
    const labels = JSON.parse(run('Inspect provenance labels', 'docker', [
      'image', 'inspect', '--format', '{{json .Config.Labels}}', inspected,
    ], { capture: true }));
    runtime[container.Service] = {
      state: container.State, health: container.Health, imageId: inspected,
      buildRevision: labels?.['org.opencontainers.image.revision'] ?? null,
      buildTime: labels?.['org.opencontainers.image.created'] ?? null,
      sourceTree: labels?.['io.juno.source.tree'] ?? null,
      sourceState: labels?.['io.juno.source.state'] ?? null,
      pullRequests: labels?.['io.juno.source.pull-requests'] ?? null,
    };
  }
  let frontendConnection = null;
  let schemaVersion = null;
  if (runtime.web?.state === 'running') {
    const probe = `const matches = process.env.JUNO_API_ORIGIN === 'http://api:3001';
      const origin = matches ? 'http://api:3001' : 'unexpected';
      const status = matches ? await fetch(origin + '/api/ready', { signal: AbortSignal.timeout(5000) })
        .then(res => res.status).catch(() => null) : null;
      console.log(JSON.stringify({ origin, status }));`;
    frontendConnection = JSON.parse(compose(state, ['exec', '-T', 'web', 'node', '--input-type=module', '-e', probe], { capture: true }));
  }
  if (containers.some(container => container.Service === 'db' && container.State === 'running')) {
    schemaVersion = Number(compose(state, ['exec', '-T', 'db', 'psql', '-U', 'juno_migrator', '-d', 'juno', '-Atv',
      'ON_ERROR_STOP=1', '-c', 'SELECT max(version) FROM juno_runtime.schema_version'], { capture: true }).trim()) || null;
  }
  const services = Object.values(runtime);
  let runtimeProvenance = 'unavailable';
  if (services.some(service => (service.buildRevision && service.buildRevision !== state.sha)
    || (service.sourceTree && service.sourceTree !== state.tree))) {
    runtimeProvenance = 'revision-or-tree-mismatch';
  } else if (services.length === 2 && services.every(service => service.buildRevision === state.sha
    && service.sourceTree === state.tree && service.sourceState === 'clean')) {
    runtimeProvenance = 'revision-and-tree-match-checkout';
  }
  console.log(JSON.stringify({
    pr: Number(state.pr), checkout: { revision: state.sha, tree: state.tree, dirty }, project: state.project,
    web: `http://127.0.0.1:${state.webPort}`, api: `http://127.0.0.1:${state.apiPort}`, schemaVersion,
    frontendConnection, containers: runtime, runtimeProvenance,
  }, null, 2));
  return runtimeProvenance;
}

async function start(state) {
  writePrivate(join(state.directory, 'state.json'), JSON.stringify(state));
  const envFile = join(state.directory, 'compose.env');
  writePrivate(envFile, [
    `JUNO_MIGRATION_PASSWORD=${secret()}`, `JUNO_DATABASE_PASSWORD=${secret()}`,
    `JUNO_WEB_PORT=${state.webPort}`, `JUNO_API_PORT=${state.apiPort}`, 'JUNO_REVIEW_BUILD_INFO=1', '',
    `JUNO_REVIEW_EXPECTED_API_REVISION=${state.sha}`, '',
  ].join('\n'));
  const config = JSON.parse(compose(state, ['config', '--format', 'json'], { capture: true }));
  assertPublishedPorts(config, state);
  confirmOwnership(state);
  const builder = 'scripts/build/review-build.mjs';
  const attested = existsSync(join(state.source, builder));
  if (attested) {
    run('Build archived, attested review source', process.execPath, [
      builder, '--project', state.project, '--env-file', envFile, '--include-pr', `${state.pr}:${state.sha}`,
    ], { cwd: state.source, env: composeEnvironment() });
  }
  compose(state, ['up', attested ? '--no-build' : '--build', '--wait', '--wait-timeout', '120']);
  await apiRequest(`http://127.0.0.1:${state.apiPort}`, '/ready');
  const fixtures = await seed(state, data => compose(state, ['run', '--rm', '-T', 'migrate',
    'pnpm', '--filter', '@juno/api', 'bootstrap-admin'], { input: JSON.stringify(data) }));
  writePrivate(join(state.directory, 'credentials.json'), JSON.stringify(fixtures, null, 2));
  const provenance = await status(state);
  if (attested && provenance !== 'revision-and-tree-match-checkout') {
    throw new Error('The running image labels do not corroborate the archived build.');
  }
  console.info(`Run pnpm review:credentials --pr ${state.pr} in a private terminal to retrieve the synthetic accounts.`);
}

function test(state) {
  const pnpm = process.env.npm_execpath;
  if (!pnpm) throw new Error('Invoke automated review through pnpm review:test.');
  const options = { cwd: state.source };
  for (const args of [['install', '--frozen-lockfile'], ['lint'], ['typecheck'], ['test'], ['exec', 'playwright', 'install', 'chromium']]) {
    run('Review workspace check', process.execPath, [pnpm, ...args], options);
  }
  run('PR disposable Compose suite', process.execPath, ['scripts/quality/validate-compose.mjs'], {
    cwd: state.source, env: { ...process.env, JUNO_WEB_PORT: String(state.webPort), JUNO_API_PORT: String(state.apiPort) },
  });
}

async function main() {
  const [action, ...args] = process.argv.slice(2);
  if (!['start', 'status', 'test', 'stop', 'credentials', 'directory'].includes(action)) throw new Error('Choose start, status, test, stop, credentials or directory.');
  const { pr, sha, webPort, apiPort } = parseArguments(args);
  // Fail without creating a checkout or registering private state when Docker is unavailable.
  const engine = action === 'start' ? dockerEngine() : undefined;
  const repo = repository();
  const directory = join(repo.directory, `pr-${pr}`);
  if (!['start', 'test'].includes(action) && (sha || webPort || apiPort)) throw new Error('This command only accepts --pr.');
  ensureDirectory(repo.directory, true);
  const lock = join(repo.directory, `pr-${pr}.lock`);
  if (action !== 'test') {
    try { mkdirSync(lock, { mode: 0o700 }); }
    catch (error) {
      if (error.code === 'EEXIST') throw new Error('A command for this persistent review is already active.');
      throw error;
    }
  }
  try {
    if (['status', 'credentials', 'stop', 'directory'].includes(action)) {
      if (!existsSync(directory)) throw new Error(`No persistent review exists for PR #${pr}.`);
      const state = recordedState(directory, repo, pr);
      if (action === 'stop') {
        stop(state);
        console.info(`Removed persistent review for PR #${pr}.`);
      } else {
        ensureCheckout(state);
        if (action === 'status') await status(state);
        else if (action === 'credentials') console.log(readPrivate(join(directory, 'credentials.json')));
        else {
          ensureCleanCheckout(state);
          confirmOwnership(state);
          await verifyDirectory(state, JSON.parse(readPrivate(join(directory, 'credentials.json'))));
        }
      }
      return;
    }

    if (action === 'start' && existsSync(directory)) {
      throw new Error(`A persistent review already exists for PR #${pr}. Inspect it with pnpm review:status --pr ${pr}.`);
    }
    const ports = await choosePorts(webPort, apiPort);
    const destination = action === 'test' ? mkdtempSync(join(repo.directory, `test-pr-${pr}-`)) : directory;
    if (action === 'start') ensureDirectory(destination, true);
    let state;
    try {
      state = createCheckout(destination, repo, pr, sha, { ...ports, engine });
      if (action === 'test') test(state);
      else await start(state);
    } catch (error) {
      if (action === 'start' && state) {
        try { stop(state); } catch {
          console.error(`Review startup did not complete. Preserve the checkout and inspect it with pnpm review:status --pr ${pr}.`);
        }
      }
      throw error;
    } finally {
      if (action === 'test' && state) removeSource(state, true);
      if (!state && !existsSync(join(destination, 'source'))) rmdirSync(destination);
    }
  } finally {
    if (action !== 'test') rmdirSync(lock);
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
