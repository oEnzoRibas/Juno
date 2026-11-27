# Harness event journal and bounded recovery

JUNO-0055, Agent 03, [coordination issue #128](https://github.com/oEnzoRibas/Juno/issues/128). The initial implementation is based on [PR #125](https://github.com/oEnzoRibas/Juno/pull/125) at `a0e0a393b3e71d658fe29b55a6671cb49d087023`. The [checkpoint verifier](../checkpoint.md) remains the task handoff entry point. The ownership registry and existing test runners keep their roles.

## Record observed evidence

Use one JSON Lines file per task run, outside the reviewed checkout. Append one complete line after observing the result using the tool, test output or acceptance record. Keep the original failure, any attempted repair and the new validation as separate events. Give one recorder ownership of a journal. The reader cannot detect tampering, coordinate concurrent writes or prove that an observation occurred. Preserve the original file when recovery needs a corrected copy.

Common fields are `version` (currently 1), `id`, `task`, `run`, `at` (UTC with milliseconds), `type`, `revision` (full lowercase Git SHA), `source` and `evidenceDigest` (lowercase SHA-256 of the associated evidence artifact). IDs and check names are lowercase slugs with letters, digits and hyphens. Use opaque identifiers. Keep artifact paths, credentials, private user information, command text and prompt contents out of the journal. Run logs may contain private material. Keep them under the appropriate access controls and inspect any public evidence separately.

| Type                   | Source                                | Additional fields                                                                                                                                                |
| ---------------------- | ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `validation.started`   | `local` or `hosted`                   | `check`, an identifier for the executed check.                                                                                                                   |
| `validation.completed` | Same source and revision as its start | `start` (the start event ID), observed `exitCode`, and `failure`. A zero exit requires `failure: null`. A nonzero exit requires a failure class and fingerprint. |
| `repair.attempted`     | `local`                               | `completion` (the observed local failure ID). Use the revision that the repair produced and that you will validate.                                              |
| `human.acceptance`     | `human`                               | The evidence digest identifies the observed maintainer acceptance.                                                                                               |

In this first increment only those four event types are supported. Actual evidence comes from the caller. Skill activation, agent activity, ownership transitions, merge state and execution metrics require separate observed evidence. A digest can bind records to reviewed bytes, and the verifier checks its consistency across the journal and receipt. It does not open the artifact or attest its origin.

## Check, decide and resume

Run with Node 24:

```sh
node scripts/harness/events/cli.mjs check /private/run.jsonl
node scripts/harness/events/cli.mjs repair /private/run.jsonl failure-a 2026-11-26T15:00:04.000Z 2 5000
node scripts/harness/checkpoint.mjs /private/checkpoint.json /private/run.jsonl
pnpm exec vitest run scripts/harness/checkpoint.test.mjs scripts/harness/events/journal.test.mjs
```

The two numbers in the repair example are the allowed attempts and elapsed milliseconds for that example run. Supply the existing assignment's limits and the observed current UTC time. Elapsed time starts at the first recorded event. The decision performs no action. Exit code 0 means the journal is valid or a proposed retry is eligible. Exit 2 means stop and inspect the printed reason. Exit 1 means invalid input or a read error.

Only `implementation` and `transient-tool` failures in local validation are eligible. Classify other failures as `dependency`, `budget`, `scope`, `ownership`, `security`, `destructive`, `human-decision` or `unknown`. Derive the fingerprint from a sanitized, stable failure identifier that survives candidate revisions and excludes paths and private values. A repeated fingerprint for the same check blocks a further attempt. A hosted result should be reviewed against its published run and revision. Agent execution, token and tool budgets remain enforced by their owners and host.

When a session resumes, check whether its validation process is still active and confirm the exact worktree, current revision and reservations. If the journal has an open validation, locate its actual result or retain it as interrupted in the handoff. Do not fabricate a completion to make a retry eligible. After an eligible repair, record the observed attempt, rerun the check locally on the recorded revision, and append the outcome. The journal counts prior recorded attempts and reports a repair awaiting validation. It has no command runner or in-band authorization to write, deploy, merge or change permissions.

## Bind a checkpoint check to a journal

The existing receipt format works without changes. For an observed check with a journal, add `provenance` containing exactly `eventId`, `source` and `evidenceDigest`, then pass the journal as the optional second CLI input. Use the slug from `validation.started.check` as the receipt check name. The verifier requires the latest completed observation for that check and source to match the task, exact head, exit code and digest. An unexecuted result cannot have provenance. Human acceptance stays in its own event. A local result, a hosted result and maintainer acceptance answer different review requirements.

## Review checkpoint

The initial implementation changes only reserved event files and the existing receipt verifier and tests. Product Compose, Playwright and SQL remain available through the maintained review tooling. Independent graph and context QA follows the published Agent 01 and Agent 02 revisions.

Original project creator: Enzo Ribas. Developed with AI assistance.
