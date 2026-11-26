import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));

function call(...args) {
  const result = spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
  assert.ifError(result.error);
  return result;
}

function json(...args) {
  const result = call(...args);
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test('enumerates ten source-backed cases and serves a blind input', () => {
  const checked = json('check');
  assert.equal(checked.caseCount, 10);
  assert.ok(checked.cases.some(({ id }) => id === 'native-psd-delivery'));

  const input = json('input', 'sql-fixture-coverage');
  assert.deepEqual(Object.keys(input).sort(), ['artifacts', 'id', 'responseFields', 'task']);
  assert.equal(call('input', '../rubrics').status, 2);
});

test('grades recorded evidence and distinguishes matched, unverified and confounded runs', () => {
  const inputSha256 = json('check').cases.find(({ id }) => id === 'sql-fixture-coverage').inputSha256;
  const sample = {
    schemaVersion: 1,
    caseId: 'sql-fixture-coverage',
    variant: 'control',
    conditions: {
      inputSha256,
      model: 'fixture-model',
      reasoningEffort: 'fixture-effort',
      toolProfile: 'read-only',
      environment: 'isolated test',
    },
    skill: { requested: null, loaded: [] },
    response: { missingFixtures: [], duplicateFixtures: [], coverage: 'complete' },
    metrics: {
      elapsedMs: 100,
      inputTokens: null,
      outputTokens: null,
      skillContextTokens: null,
      toolCalls: 1,
      humanInterventions: null,
      recoveryAttempts: 0,
    },
    failureModes: [],
    human: null,
  };
  const directory = mkdtempSync(join(tmpdir(), 'juno-harness-eval-'));
  const control = join(directory, 'control.json');
  const assisted = join(directory, 'assisted.json');
  const write = (path, record) => writeFileSync(path, JSON.stringify(record));
  try {
    write(control, sample);
    const baseline = json('grade', control);
    assert.equal(baseline.regressionsDetected, false);
    assert.equal(baseline.completed, 3);
    assert.equal(baseline.correct, 0);

    const covered = {
      ...sample,
      variant: 'skill-assisted',
      skill: { requested: 'juno-independent-review', loaded: ['juno-independent-review'] },
      response: {
        missingFixtures: ['organization-profile.sql'],
        duplicateFixtures: ['member-directory.sql'],
        coverage: 'incomplete',
        humanAcceptance: 'pending',
      },
      metrics: { ...sample.metrics, elapsedMs: 80 },
    };
    write(assisted, covered);
    const matched = json('compare', control, assisted);
    assert.equal(matched.match, 'matched');
    assert.equal(matched.skillAssisted.correct, 4);
    assert.equal(matched.skillAssisted.regressionsDetected, true);
    assert.equal(matched.observedDelta.elapsedMs, -20);
    assert.equal(matched.observedDelta.inputTokens, null);

    write(assisted, { ...covered, conditions: { ...covered.conditions, model: null } });
    assert.equal(json('compare', control, assisted).match, 'unverified');

    write(assisted, { ...covered, skill: { ...covered.skill, loaded: [] } });
    assert.equal(json('compare', control, assisted).match, 'confounded');

    write(assisted, { ...covered, conditions: { ...covered.conditions, inputSha256: 'wrong' } });
    const invalid = call('grade', assisted);
    assert.equal(invalid.status, 2);
    assert.match(invalid.stderr, /input hash/);
  } finally {
    unlinkSync(control);
    unlinkSync(assisted);
    rmdirSync(directory);
  }
});
