import { describe, it, expect, vi } from 'vitest';
import { plan, verifyGit } from './plan.mjs';
import fixture from '../../../docs/development/harness/graph/example.json' with { type: 'json' };
import { execFileSync } from 'node:child_process';

function scenario(change = () => {}) {
  const graph = structuredClone(fixture);
  change(graph, ...graph.tasks);
  return plan(graph, vi.fn());
}
describe('task allocation', () => {
  it('computes a FIFO compatible batch and a dependency-only weighted critical path', () => {
    const [a, b, c] = fixture.tasks;
    const result = scenario();
    expect(result.batch).toEqual([a.id, b.id]);
    expect(result.held[c.id]).toContain('unreleased dependency ' + a.id);
    expect(result.criticalPath).toEqual({ units: 5, tasks: [b.id, c.id] });
  });
  it.each(['executing', 'paused', 'interrupted', 'blocked', 'awaiting-review'])(
    'holds exclusive paths while %s',
    (state) => {
      const result = scenario((g, a, b) => {
        a.state = state;
        if (state === 'blocked') a.blockers = ['registry drift'];
        if (state === 'awaiting-review')
          a.checkpoint = {
            revision: a.baseRevision,
            ref: 'refs/remotes/origin/main',
            evidence: 'https://example.org/review',
          };
        b.reservedPaths = ['Scripts/Harness/Graph/readme.md'];
      });
      expect(result.batch).toEqual([]);
      expect(result.held[fixture.tasks[1].id].join(' ')).toContain('readme.md');
    },
  );
  it('separates similar filenames and reads from exclusive writes', () => {
    expect(
      scenario((g, a, b) => {
        a.reservedPaths = ['docs/test'];
        b.reservedPaths = ['docs/testing'];
        b.readOnlyInputs = ['docs/test'];
      }).batch,
    ).toHaveLength(2);
  });
  it.each([
    '../escape',
    'foo/../bar',
    'docs/.git',
    'F:/data',
    'foo*',
    'area/File.',
    'name/COM1.txt',
    'a//b',
    'foo\\bar',
    '/root',
  ])('rejects unsafe path %s', (path) => {
    expect(() =>
      scenario((g, a) => {
        a.reservedPaths = [path];
      }),
    ).toThrow('Unsafe repository path');
  });
  it('rejects unknown dependencies, duplicate tasks, cycles and undeclared pins', () => {
    expect(() =>
      scenario((g, a) => {
        a.dependencies = ['JUNO-0099'];
      }),
    ).toThrow('Unknown dependency');
    expect(() =>
      scenario((g, a, b) => {
        b.id = a.id;
      }),
    ).toThrow('Duplicate');
    expect(() =>
      scenario((g, a, b) => {
        a.dependencies = [b.id];
        b.dependencies = [a.id];
      }),
    ).toThrow('cycle');
    expect(() =>
      scenario((g, a, b) => {
        a.dependencyPins = { [b.id]: b.baseRevision };
      }),
    ).toThrow('Unexpected dependency pin');
  });
  it('requires matching pins before consuming a published unmerged task', () => {
    const result = scenario((g, a, b, c) => {
      a.state = 'awaiting-review';
      a.checkpoint = { revision: a.baseRevision, ref: 'refs/remotes/origin/topic', evidence: 'https://example.org/ci' };
      b.dependencies = [a.id];
      b.dependencyPins = { [a.id]: a.baseRevision };
      c.dependencies = [a.id];
      c.dependencyPins = { [a.id]: '0'.repeat(40) };
    });
    expect(result.batch).toEqual([fixture.tasks[1].id]);
    expect(result.held[fixture.tasks[2].id]).toContain('unreleased dependency ' + fixture.tasks[0].id);
  });
  it('blocks competing resources and occupied owners', () => {
    const result = scenario((g, a, b) => {
      b.owner = a.owner;
      b.resources = a.resources = ['disposable-db'];
    });
    expect(result.held[fixture.tasks[1].id]).toHaveLength(2);
  });
  it('fails closed on inconsistent active occupancy and missing checkpoints', () => {
    expect(() =>
      scenario((g, a, b) => {
        a.state = b.state = 'executing';
        b.reservedPaths = [a.reservedPaths[0]];
      }),
    ).toThrow('collision');
    expect(() =>
      scenario((g, a) => {
        a.state = 'completed';
      }),
    ).toThrow('checkpoint');
    expect(() =>
      scenario((g, a, b, c) => {
        c.state = 'executing';
      }),
    ).toThrow('unreleased dependencies');
  });
  it('validates real local commits and refuses stale remote pins', () => {
    const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
    const head = git('rev-parse', 'HEAD');
    expect(() => verifyGit(head)).not.toThrow();
    expect(() => verifyGit('0'.repeat(40))).toThrow();
    // A synthetic missing ref is independent of CI checkout depth and event type.
    expect(() => verifyGit(head, 'refs/remotes/origin/nonexistent-graph-probe', head)).toThrow();
  });
});
