import Ajv from 'ajv';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import schema from './schema.json' with { type: 'json' };

const validate = new Ajv({ allErrors: true }).compile(schema);
const queued = new Set(['assigned', 'acknowledged']);
const parked = new Set(['paused', 'blocked', 'interrupted']);
const published = new Set(['awaiting-review', 'completed']);

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function pathKey(path) {
  const parts = path.replace(/\/$/, '').split('/');
  assert(
    parts.every(
      (p) =>
        /^[\w.@+-][\w.@+ -]*$/u.test(p) &&
        !/[. ]$/.test(p) &&
        !/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\.|$)/i.test(p) &&
        !p.includes('~') &&
        p.toLowerCase() !== '.git',
    ),
    'Unsafe repository path: ' + path,
  );
  return parts.join('/').toLowerCase();
}

function overlap(left, right) {
  return left === right || left.startsWith(right + '/') || right.startsWith(left + '/');
}

function conflicts(a, b) {
  const reasons = [];
  const usesSlot = (t) => queued.has(t.state) || t.state === 'executing';
  if (a.owner === b.owner && usesSlot(a) && usesSlot(b)) reasons.push('owner ' + a.owner);
  for (const r of a.resources) if (b.resources.includes(r)) reasons.push('resource ' + r);
  for (const left of a.reservedPaths)
    for (const right of b.reservedPaths) if (overlap(pathKey(left), pathKey(right))) reasons.push(left + ' / ' + right);
  return reasons;
}

function dependencyOrder(tasks, byId) {
  const visited = new Set(),
    visiting = new Set(),
    result = [];
  function visit(task) {
    if (visited.has(task.id)) return;
    assert(!visiting.has(task.id), 'Dependency cycle at ' + task.id);
    visiting.add(task.id);
    for (const id of task.dependencies) {
      assert(byId.has(id), 'Unknown dependency ' + id + ' of ' + task.id);
      visit(byId.get(id));
    }
    visiting.delete(task.id);
    visited.add(task.id);
    result.push(task);
  }
  tasks.forEach(visit);
  return result;
}

function criticalPath(order) {
  const paths = new Map();
  let longest = { units: 0, tasks: [] };
  for (const t of order) {
    if (published.has(t.state)) {
      paths.set(t.id, { units: 0, tasks: [] });
      continue;
    }
    let prefix = { units: 0, tasks: [] };
    for (const id of t.dependencies) if (paths.get(id).units > prefix.units) prefix = paths.get(id);
    const path = { units: prefix.units + t.estimate, tasks: [...prefix.tasks, t.id] };
    paths.set(t.id, path);
    if (path.units > longest.units) longest = path;
  }
  return longest;
}

// A forecast over one immutable snapshot. It never opens a session or grants a lease.
export function plan(graph, verifyRevision) {
  assert(validate(graph), 'Invalid task contract: ' + JSON.stringify(validate.errors));
  const byId = new Map(graph.tasks.map((t) => [t.id, t]));
  assert(byId.size === graph.tasks.length, 'Duplicate task ID');
  const order = dependencyOrder(graph.tasks, byId);
  for (const t of order) {
    [...t.reservedPaths, ...t.readOnlyInputs].forEach(pathKey);
    assert(!t.blockers.length || t.state === 'blocked', 'Record blockers in blocked state: ' + t.id);
    assert(t.state !== 'blocked' || t.blockers.length, 'Missing blocker: ' + t.id);
    verifyRevision(t.baseRevision, undefined, undefined, t.readOnlyInputs);
    if (published.has(t.state)) assert(t.checkpoint, 'Missing published checkpoint: ' + t.id);
    if (t.checkpoint) verifyRevision(t.checkpoint.revision, t.checkpoint.ref, t.baseRevision);
    for (const id of Object.keys(t.dependencyPins ?? {}))
      assert(t.dependencies.includes(id), 'Unexpected dependency pin: ' + id);
  }
  const occupants = order.filter(
    (t) => t.state === 'executing' || parked.has(t.state) || t.state === 'awaiting-review',
  );
  const executing = occupants.filter((t) => t.state === 'executing').map((t) => t.id);
  for (const [i, t] of occupants.entries())
    for (const other of occupants.slice(i + 1)) {
      const reasons = conflicts(t, other);
      assert(!reasons.length, 'Reservation collision ' + t.id + ' and ' + other.id + ': ' + reasons.join(', '));
    }
  assert(executing.length <= graph.concurrency, 'Active execution exceeds concurrency budget');
  const batch = [],
    held = {};
  for (const task of graph.tasks) {
    const unavailable = task.dependencies.filter((id) => {
      const parent = byId.get(id);
      return !published.has(parent.state) || task.dependencyPins?.[id] !== parent.checkpoint.revision;
    });
    if (task.state === 'executing')
      assert(!unavailable.length, 'Executing task has unreleased dependencies: ' + task.id);
    if (!queued.has(task.state)) continue;
    const reasons = unavailable.map((id) => 'unreleased dependency ' + id);
    for (const other of occupants) for (const reason of conflicts(task, other)) reasons.push(other.id + ': ' + reason);
    if (executing.length + batch.length >= graph.concurrency) reasons.push('concurrency budget');
    if (reasons.length) held[task.id] = reasons;
    else {
      batch.push(task.id);
      occupants.push(task);
    }
  }
  return {
    executing,
    batch,
    held,
    parked: order.filter((t) => parked.has(t.state)).map((t) => t.id),
    criticalPath: criticalPath(order),
  };
}

export function verifyGit(revision, ref, base, inputs = []) {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
  assert(git('cat-file', '-t', revision) === 'commit', 'Expected a commit: ' + revision);
  for (const input of inputs) {
    const kind = git('cat-file', '-t', revision + ':' + input.replace(/\/$/, ''));
    assert(kind === 'tree' || kind === 'blob', 'Input is not a file or directory: ' + input);
  }
  if (ref) {
    git('check-ref-format', ref);
    assert(git('rev-parse', '--verify', ref) === revision, 'Published tracking ref has moved: ' + ref);
    git('merge-base', '--is-ancestor', base, revision);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    assert(process.argv.length === 3, 'Usage: node scripts/harness/graph/plan.mjs graph.json');
    console.log(JSON.stringify(plan(JSON.parse(readFileSync(process.argv[2], 'utf8')), verifyGit), null, 2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
