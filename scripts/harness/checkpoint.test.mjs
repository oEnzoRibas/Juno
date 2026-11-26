import assert from 'node:assert/strict';
import test from 'node:test';
import { verify } from './checkpoint.mjs';

const base = 'a'.repeat(40);
const head = 'b'.repeat(40);
const record = {
  task: 'JUNO-0047',
  base,
  head,
  reservedPaths: ['docs/', 'path.ext', 'apps/web/src/app/workspace/[id]/'],
  checks: [{ name: 'typecheck', status: 'passed', head, exitCode: 0, evidence: 'workspace log' }],
};
const fakeGit =
  (paths) =>
  (...args) => {
    switch (args[0]) {
      case 'rev-parse':
        return head + '\n';
      case 'status':
        return '';
      case 'merge-base':
        assert.deepEqual(args.slice(1), ['--is-ancestor', base, head]);
        return '';
      case 'diff':
        return paths.join('\0') + '\0';
      default:
        throw new Error('Unexpected Git request');
    }
  };

test('verifies a clean exact head, reserved paths and coherent receipts', () => {
  const actual = verify(record, fakeGit(['docs/item.md', 'path.ext', 'apps/web/src/app/workspace/[id]/page.tsx']));
  assert.deepEqual(actual, { task: record.task, base, head, touchedPaths: 3, checkReceipts: 1 });
});

test('rejects a colliding prefix and a historical or false green result', () => {
  assert.throws(() => verify(record, fakeGit(['docs-other/file.md'])), /unreserved/);
  assert.throws(() => verify({ ...record, checks: [{ ...record.checks[0], head: base }] }, fakeGit([])), /exact-head/);
  assert.throws(
    () => verify({ ...record, checks: [{ ...record.checks[0], exitCode: 1 }] }, fakeGit([])),
    /Inconsistent/,
  );
});
