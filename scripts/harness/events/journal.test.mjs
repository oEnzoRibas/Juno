import assert from 'node:assert/strict';
import { test } from 'vitest';
import { readJournal, recoveryDecision } from './journal.mjs';

const head = 'a'.repeat(40);
const nextHead = 'b'.repeat(40);
const hash = 'c'.repeat(64);
const other = 'd'.repeat(64);
const at = (second) => '2026-11-26T15:00:' + String(second).padStart(2, '0') + '.000Z';
const event = (id, second, type, fields) => ({
  version: 1,
  id,
  at: at(second),
  task: 'JUNO-0055',
  run: 'qa-a',
  revision: head,
  source: 'local',
  evidenceDigest: hash,
  type,
  ...fields,
});
const start = event('check-a', 0, 'validation.started', { check: 'typecheck' });
const failure = event('failure-a', 1, 'validation.completed', {
  start: start.id,
  exitCode: 1,
  failure: { class: 'implementation', fingerprint: hash },
});
const attempted = event('repair-a', 2, 'repair.attempted', { completion: failure.id, revision: nextHead });
const again = event('check-b', 3, 'validation.started', { check: 'typecheck', revision: nextHead });
const second = event('failure-b', 4, 'validation.completed', {
  start: again.id,
  exitCode: 1,
  revision: nextHead,
  failure: { class: 'implementation', fingerprint: other },
});
const passed = { ...second, id: 'passed-b', exitCode: 0, failure: null };
const read = (...entries) => readJournal(entries.map((entry) => JSON.stringify(entry)).join('\r\n') + '\r\n');
const decide = (journal, completion = failure.id, maxAttempts = 2, maxElapsedMs = 5000) =>
  recoveryDecision(journal, completion, at(4), { maxAttempts, maxElapsedMs });

test('preserves failure history and reports completion of a repair validation on a new revision', () => {
  const complete = read(start, failure, attempted, again, passed);
  assert.equal(complete.events.get(failure.id).exitCode, 1);
  assert.equal(complete.events.get(passed.id).exitCode, 0);
  assert.equal(complete.pendingRepair, undefined);
  assert.equal(decide(complete).reason, 'recheck-history');
  assert.equal(decide(read(start, failure, attempted, again)).reason, 'work-in-flight');
});

test('evaluates retry eligibility without executing or allowing protected operations', () => {
  assert.deepEqual(decide(read(start, failure)), {
    decision: 'retry',
    reason: null,
    remainingAttempts: 2,
    elapsedMs: 4000,
  });
  assert.equal(decide(read(start, failure), failure.id, 0).reason, 'budget');
  assert.equal(decide(read(start, failure), failure.id, 2, 4000).reason, 'budget');
  for (const classification of [
    'dependency',
    'scope',
    'budget',
    'ownership',
    'security',
    'destructive',
    'human-decision',
    'unknown',
  ]) {
    const protectedFailure = { ...failure, failure: { ...failure.failure, class: classification } };
    assert.equal(decide(read(start, protectedFailure)).reason, classification);
    assert.throws(() => read(start, protectedFailure, attempted), /recoverable local failure/);
  }
  assert.equal(decide(read({ ...start, source: 'hosted' }, { ...failure, source: 'hosted' })).reason, 'hosted-review');
});

test('stops repeated failures across candidate revisions and counts distinct attempts against the budget', () => {
  const history = read(start, failure, attempted, again, second);
  assert.equal(decide(history, second.id, 1).reason, 'budget');
  assert.equal(decide(history, second.id).decision, 'retry');
  const repeated = { ...second, failure: { ...failure.failure } };
  const repeatedHistory = read(start, failure, attempted, again, repeated);
  assert.equal(decide(repeatedHistory, repeated.id).reason, 'recheck-history');
  assert.throws(
    () =>
      read(start, failure, attempted, again, repeated, {
        ...attempted,
        id: 'repair-b',
        at: at(5),
        completion: repeated.id,
      }),
    /distinct/,
  );
});

test('rejects malformed, private or mismatched observations without replaying their contents', () => {
  assert.throws(
    () => read({ ...start, command: 'private-command-value' }),
    (error) => /Unexpected or missing/.test(error.message) && !error.message.includes('private-command-value'),
  );
  assert.throws(() => read({ ...start, type: [start.type] }), /Unknown event/);
  assert.throws(() => readJournal('not-json-with-a-private-value'), /^Error: Journal line 1: Invalid JSON\.$/);
  assert.throws(() => read(start, { ...failure, revision: nextHead }), /matching open validation/);
  assert.throws(() => read(start, { ...failure, source: 'human' }), /identity or provenance/);
  assert.throws(() => read(start, failure, { ...failure, id: 'same-completion' }), /matching open validation/);
  assert.throws(() => read(start, failure, { ...start, at: at(2) }), /Duplicate event/);
  assert.throws(() => read(start, { ...failure, at: '2026-02-30T15:00:01.000Z' }), /Invalid UTC timestamp/);
  assert.throws(() => read(start, { ...failure, run: 'other-run' }), /Task or run changed/);
  const acceptance = event('human-a', 2, 'human.acceptance', { source: 'human' });
  assert.equal(read(start, failure, acceptance).completions.size, 1);
  assert.throws(() => read(start, failure, { ...acceptance, source: 'hosted' }), /identity or provenance/);
});
