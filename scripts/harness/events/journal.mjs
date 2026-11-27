import { taskIdPattern } from '../task-id.mjs';

const identifier = /^[a-z][a-z0-9-]{0,63}$/;
const digest = /^[0-9a-f]{64}$/;
const revision = /^[0-9a-f]{40}$/;
const common = ['version', 'id', 'task', 'run', 'at', 'type', 'revision', 'source', 'evidenceDigest'];
const fields = {
  'validation.started': ['check'],
  'validation.completed': ['start', 'exitCode', 'failure'],
  'repair.attempted': ['completion'],
  'human.acceptance': [],
};
const sources = {
  'validation.started': ['local', 'hosted'],
  'validation.completed': ['local', 'hosted'],
  'repair.attempted': ['local'],
  'human.acceptance': ['human'],
};
const retriable = ['transient-tool', 'implementation'];
const failureClasses = [
  ...retriable,
  'dependency',
  'budget',
  'scope',
  'ownership',
  'security',
  'destructive',
  'human-decision',
  'unknown',
];

function requireValue(condition, message) {
  if (!condition) throw new Error(message);
}

export function timestamp(value) {
  requireValue(
    typeof value === 'string' && /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(value),
    'Use a UTC timestamp with millisecond precision.',
  );
  const time = Date.parse(value);
  requireValue(Number.isFinite(time) && new Date(time).toISOString() === value, 'Invalid UTC timestamp.');
  return time;
}

function exactKeys(value, expected) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value) &&
    Object.keys(value).length === expected.length &&
    expected.every((key) => Object.hasOwn(value, key))
  );
}

function matches(pattern, value) {
  return typeof value === 'string' && pattern.test(value);
}

function verifyEvent(event) {
  requireValue(event && typeof event.type === 'string' && Object.hasOwn(fields, event.type), 'Unknown event type.');
  requireValue(exactKeys(event, [...common, ...fields[event.type]]), 'Unexpected or missing event fields.');
  requireValue(
    event.version === 1 &&
      matches(identifier, event.id) &&
      matches(identifier, event.run) &&
      matches(taskIdPattern, event.task) &&
      matches(revision, event.revision) &&
      sources[event.type].includes(event.source) &&
      matches(digest, event.evidenceDigest),
    'Invalid event identity or provenance.',
  );
  if (event.type === 'validation.started') {
    requireValue(matches(identifier, event.check), 'Invalid validation check ID.');
  }
  if (event.type === 'validation.completed') {
    requireValue(
      matches(identifier, event.start) && Number.isSafeInteger(event.exitCode) && event.exitCode >= 0,
      'Invalid validation completion.',
    );
    if (event.exitCode === 0) {
      requireValue(event.failure === null, 'A passing validation cannot carry a failure.');
    } else {
      requireValue(
        exactKeys(event.failure, ['class', 'fingerprint']) &&
          failureClasses.includes(event.failure.class) &&
          matches(digest, event.failure.fingerprint),
        'Invalid failure classification.',
      );
    }
  }
  if (event.type === 'repair.attempted') {
    requireValue(matches(identifier, event.completion), 'Invalid repair input.');
  }
  return timestamp(event.at);
}

/** Read one ordered task/run journal without printing its input or executing any action. */
export function readJournal(input) {
  const events = new Map();
  const starts = new Map();
  const completions = new Map();
  const repaired = new Set();
  const failures = new Map();
  const latest = new Map();
  let first;
  let last;
  let lastTime;
  let pendingRepair;
  for (const [index, line] of input.trimEnd().split(/\r?\n/).entries()) {
    try {
      let event;
      try {
        event = JSON.parse(line);
      } catch {
        throw new Error('Invalid JSON.');
      }
      const at = verifyEvent(event);
      first ??= event;
      requireValue(event.task === first.task && event.run === first.run, 'Task or run changed within the journal.');
      requireValue(lastTime === undefined || at >= lastTime, 'Timestamps moved backwards.');
      requireValue(!events.has(event.id), 'Duplicate event ID.');
      lastTime = at;

      if (event.type === 'validation.started') {
        starts.set(event.id, event);
      } else if (event.type === 'validation.completed') {
        const start = starts.get(event.start);
        requireValue(
          start && start.revision === event.revision && start.source === event.source && !completions.has(event.start),
          'Completion requires a matching open validation.',
        );
        completions.set(event.start, event);
        latest.set(validationKey(start), event.id);
        if (
          pendingRepair?.check === start.check &&
          pendingRepair.revision === start.revision &&
          start.source === 'local'
        )
          pendingRepair = undefined;
        if (event.failure) {
          const key = failureKey(start, event);
          failures.set(key, (failures.get(key) ?? 0) + 1);
        }
      } else if (event.type === 'repair.attempted') {
        const completion = events.get(event.completion);
        requireValue(
          completion?.type === 'validation.completed' &&
            completion.failure &&
            completion.source === 'local' &&
            retriable.includes(completion.failure.class) &&
            !repaired.has(completion.id) &&
            !pendingRepair &&
            completions.size === starts.size &&
            latest.get(validationKey(starts.get(completion.start))) === completion.id &&
            failures.get(failureKey(starts.get(completion.start), completion)) === 1,
          'Repair requires a distinct, recoverable local failure and no open validation.',
        );
        repaired.add(completion.id);
        pendingRepair = { check: starts.get(completion.start).check, revision: event.revision };
      }
      events.set(event.id, event);
      last = event;
    } catch (error) {
      throw new Error('Journal line ' + (index + 1) + ': ' + error.message);
    }
  }
  return { first, last, events, starts, completions, repaired, failures, latest, pendingRepair };
}

function validationKey(start) {
  return start.source + ':' + start.check;
}

function failureKey(start, completion) {
  return validationKey(start) + ':' + completion.failure.fingerprint;
}

/** Evaluate one proposed repair against caller-supplied, previously authorized limits. */
export function recoveryDecision(journal, completionId, now, { maxAttempts, maxElapsedMs }) {
  const time = timestamp(now);
  requireValue(
    Number.isSafeInteger(maxAttempts) && maxAttempts >= 0 && Number.isSafeInteger(maxElapsedMs) && maxElapsedMs >= 0,
    'Repair budget must use nonnegative safe integers.',
  );
  requireValue(time >= timestamp(journal.last.at), 'Decision time precedes the recorded history.');
  const completion = journal.events.get(completionId);
  requireValue(
    completion?.type === 'validation.completed' && completion.failure,
    'Select a recorded validation failure.',
  );
  const start = journal.starts.get(completion.start);
  const remainingAttempts = Math.max(0, maxAttempts - journal.repaired.size);
  const elapsedMs = time - timestamp(journal.first.at);
  const result = (reason) => ({ decision: reason === null ? 'retry' : 'stop', reason, remainingAttempts, elapsedMs });
  if (completion.source !== 'local') return result('hosted-review');
  if (!retriable.includes(completion.failure.class)) return result(completion.failure.class);
  if (journal.pendingRepair || journal.completions.size !== journal.starts.size) return result('work-in-flight');
  if (
    journal.repaired.has(completion.id) ||
    journal.failures.get(failureKey(start, completion)) > 1 ||
    journal.latest.get(validationKey(start)) !== completion.id
  ) {
    return result('recheck-history');
  }
  if (!remainingAttempts || elapsedMs >= maxElapsedMs) return result('budget');
  return result(null);
}
