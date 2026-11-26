import { spawnSync } from 'node:child_process';
import { closeSync, mkdtempSync, openSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { encoding: 'utf8', ...options });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args[0]} failed (${result.signal ?? result.status})`);
  return result.stdout?.trim();
}

try {
  const { values } = parseArgs({ options: {
    project: { type: 'string' },
    'env-file': { type: 'string' },
    'include-pr': { type: 'string', multiple: true, default: [] },
  } });
  const project = values.project;
  if (!project || !/^[a-z0-9][a-z0-9_-]{0,62}$/.test(project)) {
    throw new Error('Use --project with a valid isolated Compose project name');
  }
  const git = (...args) => run('git', args, { stdio: ['ignore', 'pipe', 'inherit'] });
  const cwd = git('rev-parse', '--show-toplevel');
  process.chdir(cwd);
  if (git('status', '--porcelain', '--untracked-files=all')) {
    throw new Error('Build requires a clean checkout. Use a detached worktree to preserve local edits.');
  }
  const revision = git('rev-parse', '--verify', 'HEAD^{commit}');
  const tree = git('rev-parse', '--verify', `${revision}^{tree}`);
  const includedPullRequests = {};
  for (const input of values['include-pr']) {
    const [, number, sha] = /^([1-9]\d{0,8}):([0-9a-f]{40})$/.exec(input) ?? [];
    if (!number || Object.hasOwn(includedPullRequests, number)) {
      throw new Error('Use a distinct --include-pr NUMBER:FULL_SHA for each integrated input');
    }
    git('merge-base', '--is-ancestor', sha, revision);
    includedPullRequests[number] = sha;
  }
  if (values['env-file']) {
    run('docker', ['compose', '--env-file', values['env-file'], '-p', project, 'config', '--quiet'], { stdio: 'inherit' });
  }

  const cache = mkdtempSync(join(tmpdir(), 'juno-build-'));
  try {
    const archive = join(cache, 'source.tar');
    git('archive', '--format=tar', `--output=${archive}`, revision);
    const input = openSync(archive, 'r');
    const builtAt = new Date().toISOString();
    const args = [
      'buildx', 'build', '--load', '--target', 'runtime', '--tag', `juno-runtime:${project}`,
      '--build-arg', `JUNO_BUILD_REVISION=${revision}`,
      '--build-arg', `JUNO_BUILD_TREE=${tree}`,
      '--build-arg', `JUNO_BUILD_CREATED=${builtAt}`,
      '--build-arg', 'JUNO_BUILD_STATE=clean',
      '--build-arg', `JUNO_BUILD_PRS=${JSON.stringify(includedPullRequests)}`,
      '-',
    ];
    try {
      run('docker', args, { stdio: [input, 'inherit', 'inherit'] });
    } finally {
      closeSync(input);
    }
    const image = run('docker', ['image', 'inspect', `juno-runtime:${project}`, '--format', '{{.Id}}']);
    console.log(JSON.stringify({ project, revision, tree, builtAt, image, includedPullRequests }, null, 2));
  } finally {
    rmSync(cache, { recursive: true });
  }
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
