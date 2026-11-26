import { createHash } from 'node:crypto';
import { readdir, readFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';

const corpus = new URL('./corpus/', import.meta.url);
const schemaVersion = 1;
const conditionKeys = ['model', 'reasoningEffort', 'toolProfile', 'environment'];
const metricKeys = [
  'elapsedMs',
  'inputTokens',
  'outputTokens',
  'skillContextTokens',
  'toolCalls',
  'humanInterventions',
  'recoveryAttempts',
];

function requireValue(valid, message) {
  if (!valid) throw new Error(message);
}

function object(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function text(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function stringList(value) {
  return Array.isArray(value) && value.every(text) && new Set(value).size === value.length;
}

async function readJson(filename) {
  return JSON.parse(await readFile(filename, 'utf8'));
}

async function readInput(id) {
  requireValue(typeof id === 'string' && /^[a-z][a-z0-9-]*$/.test(id), 'Invalid case ID.');
  const input = await readJson(new URL('inputs/' + id + '.json', corpus));
  requireValue(
    object(input) &&
      input.id === id &&
      text(input.task) &&
      object(input.artifacts) &&
      object(input.responseFields) &&
      Object.keys(input.responseFields).length > 0 &&
      Object.values(input.responseFields).every(text),
    'Invalid evaluation input: ' + id,
  );
  return input;
}

function digest(input) {
  return createHash('sha256').update(JSON.stringify(input)).digest('hex');
}

async function checkCorpus() {
  const files = await readdir(new URL('inputs/', corpus));
  const rubrics = await readJson(new URL('rubrics.json', corpus));
  const ids = rubrics.map((item) => item.id);
  requireValue(
    stringList(ids) && ids.length > 0 && isDeepStrictEqual(files.sort(), ids.map((id) => id + '.json').sort()),
    'The input directory and rubric IDs must agree.',
  );
  const cases = new Map();
  for (const rubric of rubrics) {
    const input = await readInput(rubric.id);
    const fields = Object.keys(input.responseFields).sort();
    requireValue(
      object(rubric.expected) &&
        isDeepStrictEqual(fields, Object.keys(rubric.expected).sort()) &&
        stringList(rubric.regressionFields) &&
        rubric.regressionFields.length > 0 &&
        rubric.regressionFields.every((field) => fields.includes(field)) &&
        object(rubric.source) &&
        text(rubric.source.title) &&
        (rubric.source.url === null || text(rubric.source.url)) &&
        text(rubric.humanRubric),
      'Invalid evaluation rubric: ' + rubric.id,
    );
    cases.set(rubric.id, { ...rubric, inputSha256: digest(input) });
  }
  return cases;
}

function validateRun(run, cases) {
  requireValue(object(run) && run.schemaVersion === schemaVersion, 'Expected a schemaVersion 1 run object.');
  const rubric = cases.get(run.caseId);
  requireValue(rubric, 'Unknown evaluation case.');
  requireValue(['control', 'skill-assisted'].includes(run.variant), 'Invalid run variant.');
  requireValue(
    object(run.conditions) && run.conditions.inputSha256 === rubric.inputSha256,
    'Run input hash does not match the corpus.',
  );
  requireValue(
    conditionKeys.every((key) => run.conditions[key] === null || text(run.conditions[key])),
    'Record every environment condition as text or null.',
  );
  requireValue(
    object(run.skill) &&
      (run.variant === 'control' ? run.skill.requested === null : text(run.skill.requested)) &&
      (run.skill.loaded === null || stringList(run.skill.loaded)),
    'Record the requested skill by variant and the observed loaded skills or null.',
  );
  requireValue(
    object(run.metrics) &&
      metricKeys.every(
        (key) => run.metrics[key] === null || (Number.isSafeInteger(run.metrics[key]) && run.metrics[key] >= 0),
      ),
    'Record every metric as a nonnegative safe integer or null.',
  );
  requireValue(run.response === null || object(run.response), 'Response must be the submitted JSON object or null.');
  requireValue(
    run.failureModes === null || stringList(run.failureModes),
    'Failure modes must be distinct text or null.',
  );
  requireValue(
    run.human === null ||
      (object(run.human) && ['pass', 'fail', 'uncertain'].includes(run.human.verdict) && text(run.human.evidence)),
    'Record human validation as a verdict with evidence or null.',
  );
  return rubric;
}

function equalClaim(actual, expected) {
  if (!Array.isArray(expected)) return isDeepStrictEqual(actual, expected);
  return Array.isArray(actual) && actual.length === expected.length && expected.every((item) => actual.includes(item));
}

function grade(run, cases) {
  const rubric = validateRun(run, cases);
  const claims = run.response ?? {};
  const criteria = Object.entries(rubric.expected).map(([field, expected]) => {
    const status = !Object.hasOwn(claims, field) ? 'missing' : equalClaim(claims[field], expected) ? 'pass' : 'fail';
    return { field, status };
  });
  const correct = criteria.filter(({ status }) => status === 'pass').length;
  const completed = criteria.filter(({ status }) => status !== 'missing').length;
  const regressionsDetected = rubric.regressionFields.every(
    (field) => criteria.find((criterion) => criterion.field === field).status === 'pass',
  );
  const activation =
    run.variant === 'control' || run.skill.loaded === null ? null : run.skill.loaded.includes(run.skill.requested);
  return {
    caseId: run.caseId,
    variant: run.variant,
    completed,
    correct,
    total: criteria.length,
    regressionsDetected,
    criteria,
    activation,
    metrics: Object.fromEntries(metricKeys.map((key) => [key, run.metrics[key]])),
    failureModes: run.failureModes,
    humanRubric: rubric.humanRubric,
    human: run.human,
  };
}

function compare(control, assisted, cases) {
  const baseline = grade(control, cases);
  const intervention = grade(assisted, cases);
  requireValue(
    baseline.variant === 'control' &&
      intervention.variant === 'skill-assisted' &&
      baseline.caseId === intervention.caseId,
    'Compare one control and one skill-assisted run of the same case in that order.',
  );
  const unknownConditions = conditionKeys.filter(
    (key) => control.conditions[key] === null || assisted.conditions[key] === null,
  );
  const differingConditions = conditionKeys.filter(
    (key) => !unknownConditions.includes(key) && control.conditions[key] !== assisted.conditions[key],
  );
  const controlContaminated = control.skill.loaded?.includes(assisted.skill.requested) ?? null;
  const match =
    differingConditions.length || controlContaminated === true || intervention.activation === false
      ? 'confounded'
      : unknownConditions.length || controlContaminated === null || intervention.activation === null
        ? 'unverified'
        : 'matched';
  const observedDelta = Object.fromEntries(
    metricKeys.map((key) => {
      const before = baseline.metrics[key];
      const after = intervention.metrics[key];
      return [key, before === null || after === null ? null : after - before];
    }),
  );
  return {
    caseId: control.caseId,
    inputSha256: control.conditions.inputSha256,
    match,
    differingConditions,
    unknownConditions,
    controlContaminated,
    observedDelta,
    control: baseline,
    skillAssisted: intervention,
  };
}

async function run([command, ...args]) {
  if (command === 'input' && args.length === 1) return readInput(args[0]);
  if (command === 'check' && args.length === 0) {
    const cases = await checkCorpus();
    return {
      schemaVersion,
      caseCount: cases.size,
      cases: [...cases.values()].map(({ id, inputSha256, source }) => ({ id, inputSha256, source })),
    };
  }
  if (command === 'grade' && args.length === 1) return grade(await readJson(args[0]), await checkCorpus());
  if (command === 'compare' && args.length === 2) {
    return compare(await readJson(args[0]), await readJson(args[1]), await checkCorpus());
  }
  throw new Error('Usage: cli.mjs check | input CASE_ID | grade RUN.json | compare CONTROL.json ASSISTED.json');
}

try {
  console.log(JSON.stringify(await run(process.argv.slice(2)), null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 2;
}
