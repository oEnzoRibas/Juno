import { execFileSync } from 'node:child_process';
import { readFileSync, statSync } from 'node:fs';

// Caller-owned JSON is separate from repository source. No command from either is executed.
function readJson(file) {
  if (!statSync(file).isFile() || statSync(file).size > 1024 * 1024) {
    throw new Error('Expected a JSON file of at most 1 MiB');
  }
  return JSON.parse(readFileSync(file, 'utf8').replace(/^\uFEFF/, ''));
}

function git(args, options = {}) {
  return execFileSync('git', ['--no-replace-objects', '--literal-pathspecs', ...args], {
    stdio: ['ignore', 'pipe', 'pipe'],
    env: { ...process.env, GIT_NO_LAZY_FETCH: '1' },
    ...options,
  });
}

function nonempty(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function validatePath(value) {
  if (
    !nonempty(value) ||
    /[\\:*?\u0000-\u001f\u007f]/u.test(value) ||
    value
      .split('/')
      .some((segment) => !segment || segment === '.' || segment === '..' || segment.toLowerCase() === '.git')
  ) {
    throw new Error('Expected a literal repository-relative path: ' + JSON.stringify(value));
  }
}

function validateEnvelope(task) {
  for (const field of ['id', 'objective', 'owner', 'baseRevision', 'state', 'recovery']) {
    if (!nonempty(task?.[field])) throw new Error('Expected nonempty task field: ' + field);
  }
  for (const field of [
    'reservedPaths',
    'readOnlyInputs',
    'dependencies',
    'requirements',
    'expectedArtifacts',
    'skills',
    'tools',
    'acceptanceCriteria',
    'validation',
    'permissions',
    'blockers',
  ]) {
    if (!Array.isArray(task[field]) || !task[field].every(nonempty)) throw new Error('Expected string array: ' + field);
  }
  if (
    !/^(?:[0-9a-f]{40}|[0-9a-f]{64})$/.test(task.baseRevision) ||
    git(['rev-parse', '--verify', task.baseRevision + '^{commit}'])
      .toString()
      .trim() !== task.baseRevision
  ) {
    throw new Error('Expected the full object ID of an available commit');
  }
  for (const path of [...task.readOnlyInputs, ...task.reservedPaths]) validatePath(path.replace(/\/$/, ''));
}

function mergeSelections(rows, inputs) {
  if (!Array.isArray(rows)) throw new Error('Selection must be an array');
  const byPath = new Map();
  for (const row of rows) {
    validatePath(row?.path);
    if (!['inline', 'reference'].includes(row.mode) || !nonempty(row.reason))
      throw new Error('Selection needs a mode and reason');
    if (!inputs.some((p) => row.path === p || row.path.startsWith(p.replace(/\/$/, '') + '/'))) {
      throw new Error('Outside readOnlyInputs: ' + row.path);
    }
    const selected = byPath.get(row.path) ?? { path: row.path, mode: 'reference', reasons: new Set() };
    if (row.mode === 'inline') selected.mode = 'inline';
    selected.reasons.add(row.reason);
    byPath.set(row.path, selected);
  }
  return Array.from(byPath.values()).sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));
}

function assemble(task, rows, budget) {
  validateEnvelope(task);
  const sources = [];
  let inlineBytes = 0;
  for (const { path, mode, reasons } of mergeSelections(rows, task.readOnlyInputs)) {
    // Exact ls-tree results also enforce real directory ancestry: Git never follows symlinks.
    const entry = git(['ls-tree', '--full-tree', '-z', task.baseRevision, '--', path]).toString('utf8');
    const [header, listed] = entry.slice(0, -1).split('\t');
    const [permissions, type, blob] = header.split(' ');
    if (listed !== path || type !== 'blob' || !['100644', '100755'].includes(permissions)) {
      throw new Error('Expected a regular file at the pinned revision: ' + path);
    }
    const bytes = Number(git(['cat-file', '-s', blob]).toString().trim());
    const source = { path, mode, reasons: [...reasons].sort(), blob, bytes };
    if (mode === 'inline') {
      inlineBytes += bytes;
      if (inlineBytes > budget) throw new Error('Inline sources exceed byte budget');
      const data = git(['cat-file', 'blob', blob], { maxBuffer: bytes + 1024 });
      if (data.includes(0)) throw new Error('Inline source contains NUL: ' + path);
      source.content = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(data);
    }
    sources.push(source);
  }
  const result = JSON.stringify({ version: 1, task, sources }, null, 2) + '\n';
  if (Buffer.byteLength(result) > budget)
    throw new Error('Serialized context exceeds byte budget: ' + Buffer.byteLength(result));
  return result;
}

try {
  const [command, envelope, selection, option, limit, ...extra] = process.argv.slice(2);
  if (
    command !== 'assemble' ||
    !envelope ||
    !selection ||
    option !== '--budget' ||
    !/^[1-9]\d*$/.test(limit) ||
    !Number.isSafeInteger(Number(limit)) ||
    extra.length
  ) {
    throw new Error('Usage: node cli.mjs assemble envelope.json selection.json --budget BYTES');
  }
  process.stdout.write(assemble(readJson(envelope), readJson(selection), Number(limit)));
} catch (error) {
  process.stderr.write(error.message + '\n');
  process.exitCode = 1;
}
