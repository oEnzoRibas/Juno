import assert from 'node:assert/strict';
import { test } from 'vitest';
import { verify } from './checkpoint.mjs';
import { readJournal } from './events/journal.mjs';

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
test('binds additive check provenance to the task, exact head, source, command and result', () => {
  const evidenceDigest = 'c'.repeat(64);
  const metadata = {
    version: 1,
    task: record.task,
    run: 'run-a',
    revision: head,
    source: 'local',
    evidenceDigest,
    at: '2026-11-26T15:00:00.000Z',
  };
  const start = { ...metadata, id: 'start-a', type: 'validation.started', check: 'typecheck' };
  const completed = {
    ...metadata,
    id: 'end-a',
    type: 'validation.completed',
    start: start.id,
    exitCode: 0,
    failure: null,
  };
  const latestFailure = {
    ...completed,
    id: 'end-b',
    start: 'start-b',
    exitCode: 1,
    failure: { class: 'implementation', fingerprint: evidenceDigest },
  };
  const parse = (...events) => readJournal(events.map((event) => JSON.stringify(event)).join('\n'));
  const receipt = {
    ...record,
    checks: [{ ...record.checks[0], provenance: { eventId: completed.id, source: 'local', evidenceDigest } }],
  };
  assert.equal(verify(receipt, fakeGit([]), parse(start, completed)).checkReceipts, 1);
  assert.throws(() => verify(receipt, fakeGit([])), /matching observed/);
  assert.throws(() => verify(receipt, fakeGit([]), parse({ ...start, check: 'lint' }, completed)), /matching observed/);
  assert.throws(
    () => verify(receipt, fakeGit([]), parse({ ...start, source: 'hosted' }, { ...completed, source: 'hosted' })),
    /matching observed/,
  );
  assert.throws(
    () => verify(receipt, fakeGit([]), parse(start, completed, { ...start, id: 'start-b' }, latestFailure)),
    /matching observed/,
  );
  assert.throws(
    () =>
      verify(
        { ...receipt, checks: [{ ...receipt.checks[0], status: 'not-run', head: null, exitCode: null }] },
        fakeGit([]),
        parse(start, completed),
      ),
    /unexecuted/,
  );
});
