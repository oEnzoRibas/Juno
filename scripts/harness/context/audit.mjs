import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('./cli.mjs', import.meta.url));
const rows = [];
for (const name of ['shell', 'resume']) {
  const dir = 'docs/development/harness/context/examples/' + name;
  const task = JSON.parse(readFileSync(dir + '/task.json', 'utf8'));
  const bytes = execFileSync(process.execPath, [
    cli,
    'assemble',
    dir + '/task.json',
    dir + '/selection.json',
    '--budget',
    '32000',
  ]);
  const payload = JSON.parse(bytes);
  assert.deepEqual(payload.task, task);
  assert.deepEqual(new Set(payload.sources.map((source) => source.path)), new Set(task.readOnlyInputs));
  let allInlineSourceBytes = 0,
    inlineSourceBytes = 0;
  for (const source of payload.sources) {
    const raw = execFileSync('git', [
      '--no-replace-objects',
      'cat-file',
      'blob',
      task.baseRevision + ':' + source.path,
    ]);
    assert.equal(raw.length, source.bytes);
    if (source.mode === 'inline') {
      assert.equal(source.content, raw.toString('utf8'));
      inlineSourceBytes += raw.length;
    }
    allInlineSourceBytes += raw.length;
  }
  rows.push({
    case: name,
    base: task.baseRevision,
    sourceFiles: payload.sources.length,
    allInlineSourceBytes,
    inlineSourceBytes,
    packageBytes: bytes.length,
    budgetBytes: 32000,
  });
}
console.log(JSON.stringify(rows, null, 2));
