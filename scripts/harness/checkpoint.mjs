import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const sha = /^[0-9a-f]{40}$/;
const isRevision = (value) => typeof value === 'string' && sha.test(value);
const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

function verifyReservations(paths) {
  if (!Array.isArray(paths) || paths.length === 0) throw new Error('Provide one or more reserved paths.');
  for (const path of paths) {
    if (typeof path !== 'string' || /[\\:*?\x00-\x1f]/.test(path) || path.startsWith('/')) {
      throw new Error('Reserved paths must be literal repository-relative paths.');
    }
    const segments = path.replace(/\/$/, '').split('/');
    if (segments.some((segment) => !segment || segment === '.' || segment === '..')) {
      throw new Error('Reserved paths must not contain empty or relative segments.');
    }
  }
}

export function verify(record, git) {
  if (
    !isRecord(record) ||
    typeof record.task !== 'string' ||
    !/^JUNO-[0-9]{4}(?:-[a-z][a-z0-9-]*)?$/.test(record.task)
  ) {
    throw new Error('Provide a JUNO task ID.');
  }
  const { base, head, reservedPaths, checks } = record;
  if (!isRevision(base) || !isRevision(head)) throw new Error('Base and head must be exact 40-character SHAs.');
  verifyReservations(reservedPaths);
  if (git('rev-parse', 'HEAD').trim() !== head) throw new Error('The checked-out HEAD differs from the claimed head.');
  if (git('status', '--porcelain=v1', '-z', '--untracked-files=all')) throw new Error('The review checkout is dirty.');
  git('merge-base', '--is-ancestor', base, head);
  const touched = git('diff', '--no-renames', '--name-only', '-z', base, head, '--').split('\0').filter(Boolean);
  const outside = touched.filter(
    (path) => !reservedPaths.some((scope) => (scope.endsWith('/') ? path.startsWith(scope) : path === scope)),
  );
  if (outside.length) throw new Error(`Diff contains unreserved paths: ${outside.join(', ')}`);
  if (!Array.isArray(checks)) throw new Error('Provide a list of check receipts.');
  const names = new Set();
  for (const check of checks) {
    if (!isRecord(check) || typeof check.name !== 'string' || !check.name.trim() || names.has(check.name)) {
      throw new Error('Check receipts need unique names.');
    }
    names.add(check.name);
    if (check.status === 'not-run' && check.head === null && check.exitCode === null) continue;
    if (
      !['passed', 'failed'].includes(check.status) ||
      check.head !== head ||
      !Number.isInteger(check.exitCode) ||
      check.exitCode < 0
    ) {
      throw new Error(`Missing exact-head result for ${check.name}.`);
    }
    if (
      (check.status === 'passed') !== (check.exitCode === 0) ||
      typeof check.evidence !== 'string' ||
      !check.evidence.trim()
    ) {
      throw new Error(`Inconsistent exit code or missing evidence for ${check.name}.`);
    }
  }
  return { task: record.task, base, head, touchedPaths: touched.length, checkReceipts: names.size };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv.length !== 3) throw new Error('Usage: node scripts/harness/checkpoint.mjs <checkpoint.json>');
    const record = JSON.parse(readFileSync(process.argv[2], 'utf8'));
    const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    console.info(JSON.stringify(verify(record, git), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
