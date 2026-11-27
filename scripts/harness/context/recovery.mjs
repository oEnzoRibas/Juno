import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { isDeepStrictEqual } from 'node:util';

const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const parse = (bytes) => JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
const serialize = (value) => JSON.stringify(value, null, 2) + '\n';

function noteList(notes, key) {
  const list = notes?.[key];
  if (!Array.isArray(list) || !list.every((item) => typeof item === 'string' && item.trim())) {
    throw new Error(`Handoff notes require an array of nonempty strings for ${key}.`);
  }
  return list;
}

export function createRecovery(packageBytes, verified, notes) {
  const context = parse(packageBytes);
  if (context?.version !== 1 || !context.task || !Array.isArray(context.sources)) {
    throw new Error('Expected a version 1 context package.');
  }
  noteList(context.task, 'blockers');
  if (typeof context.task.recovery !== 'string' || !context.task.recovery.trim())
    throw new Error('Missing task recovery instructions.');
  const { task, base, head, touchedPaths, checkReceipts } = verified ?? {};
  if (
    typeof task !== 'string' ||
    !/^JUNO-\d{4}$/.test(task) ||
    ![base, head].every((value) => typeof value === 'string' && /^[0-9a-f]{40}$/.test(value)) ||
    ![touchedPaths, checkReceipts].every((value) => Number.isSafeInteger(value) && value >= 0)
  ) {
    throw new Error('Expected JSON summary emitted by the checkpoint verifier.');
  }
  if (context.task.checkpoint && context.task.checkpoint.revision !== head)
    throw new Error('Checkpoint head differs from the scheduler pin.');
  if (task !== context.task.id || base !== context.task.baseRevision) {
    throw new Error('Checkpoint task or base differs from the context package.');
  }
  return {
    version: 1,
    packageSha256: digest(packageBytes),
    checkpoint: { task, base, head, touchedPaths, checkReceipts },
    packageState: { blockers: context.task.blockers, recovery: context.task.recovery },
    notes: { blockers: noteList(notes, 'blockers'), nextSteps: noteList(notes, 'nextSteps') },
  };
}

export function verifyRecovery(packageBytes, verified, packBytes, trustedSha256) {
  if (typeof trustedSha256 !== 'string' || !/^[0-9a-f]{64}$/.test(trustedSha256)) {
    throw new Error('Supply a trusted lowercase SHA-256 of the recovery file.');
  }
  if (digest(packBytes) !== trustedSha256) throw new Error('Recovery file differs from the trusted digest.');
  const pack = parse(packBytes);
  const expected = createRecovery(packageBytes, verified, pack?.notes);
  if (!isDeepStrictEqual(pack, parse(Buffer.from(serialize(expected))))) {
    throw new Error('Recovery contents differ from the supplied package or checkpoint summary.');
  }
  return pack;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const [mode, context, summary, handoff, trusted, ...extra] = process.argv.slice(2);
    if (!handoff || extra.length || !(mode === 'create' ? trusted === undefined : mode === 'verify' && trusted)) {
      throw new Error(
        'Usage: recovery.mjs create <package> <summary> <notes> | verify <package> <summary> <pack> <sha256>',
      );
    }
    const packageBytes = readFileSync(context);
    const verified = parse(readFileSync(summary));
    const input = readFileSync(handoff);
    if (mode === 'create') {
      const output = serialize(createRecovery(packageBytes, verified, parse(input)));
      process.stdout.write(output);
      process.stderr.write(`Recovery SHA-256: ${digest(output)}\n`);
    } else {
      const { checkpoint } = verifyRecovery(packageBytes, verified, input, trusted);
      process.stdout.write(serialize(checkpoint));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
