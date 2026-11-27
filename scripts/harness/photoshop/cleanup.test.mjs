import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import { expect, test } from 'vitest';

const source = readFileSync(new URL('./cleanup.jsx', import.meta.url), 'utf8');

function fixture(failures = []) {
  const calls = [];
  const original = { name: 'User document', saved: false };
  function attempt(name, value) {
    calls.push([name, value]);
    if (failures.includes(name)) throw Error(name + ' unavailable');
  }
  const app = {
    preferences: {
      set rulerUnits(value) {
        attempt('units', value);
      },
    },
    set displayDialogs(value) {
      attempt('dialogs', value);
    },
    set activeDocument(value) {
      attempt('active', value);
    },
  };
  const doc = {
    close(value) {
      attempt('close', value);
    },
  };
  const restore = runInNewContext(source + '\njunoRestoreProof', { SaveOptions: { DONOTSAVECHANGES: 'discard' } });
  return { restore, calls, doc, app, original };
}

test.each(
  [[], ['close'], ['units'], ['dialogs'], ['active'], ['close', 'units', 'dialogs', 'active']].map((failures) => ({
    failures,
  })),
)('attempts every restoration after failures %j', ({ failures }) => {
  const f = fixture(failures);
  const run = () => f.restore(f.doc, f.app, f.original, 'pixels-before', 'dialogs-before');
  if (failures.length) expect(run).toThrow(/Cleanup failed/);
  else run();
  expect(f.calls).toEqual([
    ['close', 'discard'],
    ['units', 'pixels-before'],
    ['dialogs', 'dialogs-before'],
    ['active', f.original],
  ]);
  expect(f.original).toEqual({ name: 'User document', saved: false });
});
test('handles an interrupted create without a proof or original document', () => {
  const f = fixture();
  f.restore(null, f.app, null, 'old', 'old');
  expect(f.calls).toEqual([
    ['units', 'old'],
    ['dialogs', 'old'],
  ]);
});
test('retains the original failure when reporting cleanup failures', () => {
  const f = fixture(['close', 'dialogs']);
  expect(() => f.restore(f.doc, f.app, f.original, 1, 2, Error('render interrupted'))).toThrow(
    /render interrupted.*close proof.*dialog preferences/,
  );
});
