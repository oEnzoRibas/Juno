import assert from 'node:assert/strict';
import { test } from 'vitest';
import { execFileSync, spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { createRecovery, verifyRecovery } from './recovery.mjs';

const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
const example = JSON.parse(
  readFileSync(new URL('../../../docs/development/harness/context/examples/resume/task.json', import.meta.url)),
);
function setup(t) {
  const cwd = mkdtempSync(join(tmpdir(), 'juno-context-'));
  t.onTestFinished(() => rmSync(cwd, { recursive: true, force: true }));
  const git = (...args) => execFileSync('git', args, { cwd, encoding: 'utf8' });
  git('init', '--quiet');
  mkdirSync(join(cwd, 'docs'));
  writeFileSync(join(cwd, 'docs', '[id].md'), 'ação\n');
  writeFileSync(join(cwd, 'docs', 'binary'), Buffer.from([0xff, 0x7e]));
  writeFileSync(join(cwd, 'docs', 'zero'), Buffer.of(0));
  writeFileSync(join(cwd, 'secret'), 'out of scope');
  git('add', '.');
  // Install a symlink in the index only; this runs on Windows without symlink privileges.
  const target = git('rev-parse', ':secret').trim();
  git('update-index', '--add', '--cacheinfo', '120000,' + target + ',docs/link');
  git(
    '-c',
    'user.name=Harness Test',
    '-c',
    'user.email=harness@example.invalid',
    '-c',
    'commit.gpgsign=false',
    'commit',
    '--quiet',
    '-m',
    'fixture',
  );
  const task = { ...example, baseRevision: git('rev-parse', 'HEAD').trim(), readOnlyInputs: ['docs/'] };
  writeFileSync(join(cwd, 'docs', '[id].md'), 'working copy must not enter context');
  const row = { path: 'docs/[id].md', mode: 'inline', reason: 'Review localised copy' };
  function run(rows = [row], limit = 8192, envelope = task) {
    writeFileSync(join(cwd, 'task.json'), JSON.stringify(envelope));
    writeFileSync(join(cwd, 'select.json'), JSON.stringify(rows));
    return spawnSync(process.execPath, [cli, 'assemble', 'task.json', 'select.json', '--budget', String(limit)], {
      cwd,
    });
  }
  return { task, row, run };
}

test(
  'uses pinned UTF-8, directory authority and literal route names; deduplicates selections deterministically',
  { timeout: 30000 },
  (t) => {
    const { task, row, run } = setup(t);
    const rows = [
      { ...row, mode: 'reference', reason: 'Alternative' },
      row,
      row,
      { path: 'docs/binary', mode: 'reference', reason: 'defer binary' },
    ];
    const out = run(rows);
    assert.equal(out.status, 0, out.stderr.toString());
    const { sources, task: actual } = JSON.parse(out.stdout);
    assert.deepEqual(actual, task);
    assert.equal(sources.length, 2);
    assert.equal(sources[0].content, 'ação\n');
    assert.deepEqual(sources[0].reasons, ['Alternative', row.reason]);
    assert.equal(sources[0].bytes, Buffer.byteLength(sources[0].content));
    assert.match(sources[0].blob, /^[0-9a-f]{40}$/);
    assert.equal('content' in sources[1], false);
    assert.deepEqual(run(rows.reverse()).stdout, out.stdout);
    assert.equal(run(rows, out.stdout.length).status, 0);
    assert.equal(run(rows, out.stdout.length - 1).stdout.length, 0);
    assert.notEqual(run(rows, out.stdout.length - 1).status, 0);
  },
);
test('rejects absent, binary, traversal, symlink and unauthorized inline sources', { timeout: 30000 }, (t) => {
  const { run, row, task } = setup(t);
  for (const path of [
    'secret',
    'docs/../secret',
    'docs/missing',
    'docs/link',
    'docs/zero',
    'docs/binary',
    'docs',
    'C:/file',
    'docs/link/child',
  ]) {
    const result = run([{ ...row, path }]);
    assert.notEqual(result.status, 0, path);
    assert.equal(result.stdout.length, 0);
  }
  for (const [rows, limit, envelope] of [
    [[row], 32, task],
    [[row], 8192, { ...task, baseRevision: 'HEAD' }],
    [[row], 8192, { ...task, acceptanceCriteria: null }],
    [[{ ...row, mode: 'unbounded' }], 8192, task],
  ]) {
    const result = run(rows, limit, envelope);
    assert.notEqual(result.status, 0);
    assert.equal(result.stdout.length, 0);
  }
});
test(
  'recovery round trip detects a changed package, receipt, external digest or handoff notes',
  { timeout: 30000 },
  (t) => {
    const { task, run } = setup(t);
    const bytes = run().stdout,
      summary = { task: task.id, base: task.baseRevision, head: task.baseRevision, touchedPaths: 0, checkReceipts: 0 };
    const notes = { blockers: ['External review outstanding'], nextSteps: ['Read individual receipts.'] };
    const pack = createRecovery(bytes, summary, notes);
    const raw = Buffer.from(JSON.stringify(pack) + '\n');
    const sha = createHash('sha256').update(raw).digest('hex');
    assert.deepEqual(verifyRecovery(bytes, summary, raw, sha), pack);
    assert.deepEqual(pack.packageState.blockers, task.blockers);
    const conflictingPin = Buffer.from(
      JSON.stringify({ ...JSON.parse(bytes), task: { ...task, checkpoint: { revision: 'f'.repeat(40) } } }),
    );
    assert.throws(() => createRecovery(conflictingPin, summary, notes), /scheduler pin/);
    assert.throws(() => createRecovery(bytes, { ...summary, task: 'JUNO-0001' }, notes));
    assert.throws(() => createRecovery(bytes, { ...summary, base: 'f'.repeat(40) }, notes));
    assert.throws(() => verifyRecovery(Buffer.concat([bytes, Buffer.from('\n')]), summary, raw, sha));
    assert.throws(() => verifyRecovery(bytes, { ...summary, head: 'a'.repeat(40) }, raw, sha));
    assert.throws(() =>
      verifyRecovery(bytes, summary, Buffer.from(JSON.stringify({ ...pack, notes: { ...notes, blockers: [] } })), sha),
    );
    assert.throws(() => verifyRecovery(bytes, summary, raw, '0'.repeat(64)));
  },
);
