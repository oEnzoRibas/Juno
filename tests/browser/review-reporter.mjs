import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

/** Persists only assertion summaries, without request dumps, errors, attachments or credentials. */
export default class ReviewReporter {
  results = [];

  onTestEnd(test, result) {
    const scenarios = result.steps
      .filter((step) => step.category === 'test.step' && step.title.startsWith('[review] '))
      .map((step) => ({ scenario: step.title.slice(9), passed: !step.error }));
    for (const { scenario, passed } of scenarios) {
      console.log(`[${passed ? 'PASS' : 'FAIL'}] ${scenario}`);
    }
    this.results.push({ test: test.title, status: result.status, durationMs: result.duration, scenarios });
  }

  onEnd(result) {
    const path = resolve(process.env.JUNO_REVIEW_REPORT ?? 'test-results/review-scenarios.json');
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, JSON.stringify({ status: result.status, tests: this.results }, null, 2) + '\n');
    console.log(`Structured review report: ${path}`);
  }
}
