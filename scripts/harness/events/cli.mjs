import { readFileSync } from 'node:fs';
import { readJournal, recoveryDecision } from './journal.mjs';

try {
  const [command, file, ...args] = process.argv.slice(2);
  if (!file || !((command === 'check' && args.length === 0) || (command === 'repair' && args.length === 4))) {
    throw new Error(
      'Usage: node scripts/harness/events/cli.mjs check <journal.jsonl> | repair <journal.jsonl> <completion-id> <UTC-time> <attempts> <elapsed-ms>',
    );
  }
  const journal = readJournal(readFileSync(file, 'utf8'));
  if (command === 'check') {
    console.log(
      JSON.stringify({
        task: journal.first.task,
        run: journal.first.run,
        events: journal.events.size,
        validations: journal.completions.size,
        failures: [...journal.failures.values()].reduce((sum, count) => sum + count, 0),
        repairs: journal.repaired.size,
        openValidations: journal.starts.size - journal.completions.size,
        repairAwaitingValidation: Boolean(journal.pendingRepair),
      }),
    );
  } else {
    const [id, now, attempts, elapsed] = args;
    if (![attempts, elapsed].every((value) => /^\d+$/.test(value))) throw new Error('Repair budget requires integers.');
    const result = recoveryDecision(journal, id, now, { maxAttempts: Number(attempts), maxElapsedMs: Number(elapsed) });
    console.log(JSON.stringify(result));
    if (result.decision === 'stop') process.exitCode = 2;
  }
} catch (error) {
  console.error(error.code ? 'Could not read journal: ' + error.code : error.message);
  process.exitCode = 1;
}
