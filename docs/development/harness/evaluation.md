# Agent harness evaluation

JUNO-0053 uses synthetic replay inputs informed by recorded Juno incidents. The baseline is the pre-intervention `main` revision `a75e7dcca90d4868302e0b558da29d48f643a4fe`. The incident references in the corpus establish provenance. Case inputs, numbers, and identifiers are constructed examples. This suite is a local observation and scoring tool.

## Corpus and repeatable commands

Use Node 24 from the repository root. The CLI uses Node built-ins. It reads local JSON and prints JSON to standard output. An invalid invocation or record returns exit code 2. A valid grade returns exit code 0 even if every criterion fails.

```powershell
node scripts/harness/eval/cli.mjs check
node scripts/harness/eval/cli.mjs input sql-fixture-coverage
node --test scripts/harness/eval/self-test.mjs
node scripts/harness/eval/cli.mjs grade <path-to-run.json>
node scripts/harness/eval/cli.mjs compare <path-to-control.json> <path-to-skill-assisted.json>
```

The [input directory](../../../scripts/harness/eval/corpus/inputs) contains the task, evidence and response field contract. The [scoring rubrics](../../../scripts/harness/eval/corpus/rubrics.json) separately contain expected claims, source records and human review guidance. Give solving sessions the output of `input` or a standalone copy of its file in a read-only sandbox. Keep the rubrics and other agents' answers outside that sandbox. The `check` command lists each input SHA-256. It hashes the compact serialization of the parsed input JSON, which is stable across line endings and whitespace-only file formatting.

| Case                         | Evidence to inspect                                                               |
| ---------------------------- | --------------------------------------------------------------------------------- |
| `sql-fixture-coverage`       | Required fixture list and actually executed files                                 |
| `runtime-identity`           | Checkout, running image and observed web-to-API revision                          |
| `tenant-isolation`           | Positive and negative authorization outcomes                                      |
| `pr-review-instructions`     | Current head and reproducible review steps                                        |
| `mobile-overlay-clipping`    | Reachability, viewport bounds and focus observations                              |
| `design-system-consistency`  | Shared controls, tokens and documented variants                                   |
| `cross-agent-ownership`      | Published path claims, status and transfer evidence                               |
| `interrupted-agent-recovery` | Last verified checkpoint, local edits and incomplete execution                    |
| `incorrect-test-success`     | Current process exit status and tested scope                                      |
| `native-psd-delivery`        | Native editable Photoshop master versus preview export, reopen and layer evidence |

## Matched runs

1. Select representative cases for the change and state the purpose of each pair. A single-case pilot verifies the measurement path.
2. Pin the subject revision, Codex version or surface, model, reasoning effort, tool profile, workspace isolation and permitted tools. Use new sessions with the same case and permitted evidence in each arm. Give the control the ordinary prompt. In the skill-assisted arm, add only the named workflow and its scoped references. Record the exact skill revision and observed activation from the session instructions or tool trace.
3. Capture the response, started/completed markers, and actual observations. Use observed tool events, tool permissions and visible platform measurements. For multiple repeats, balance the order of arms, use fresh sessions and keep the extraction rules identical. Keep raw records in the authorized research workspace, with live credentials, identities and host-specific paths removed from published material.
4. Grade each pair, then have an independent reviewer read the answer and sanitized trace, preferably blinded to the variant. Use the printed case-specific rubric. Record `pass`, `fail` or `uncertain` with evidence. Use `uncertain` where the record cannot establish judgment-dependent criteria. Keep human verdicts separate from deterministic scores.

A run uses the following fields:

```json
{
  "schemaVersion": 1,
  "caseId": "sql-fixture-coverage",
  "variant": "control",
  "conditions": {
    "inputSha256": "<hash from check>",
    "model": null,
    "reasoningEffort": null,
    "toolProfile": null,
    "environment": null
  },
  "skill": {
    "requested": null,
    "loaded": null
  },
  "response": null,
  "metrics": {
    "elapsedMs": null,
    "inputTokens": null,
    "outputTokens": null,
    "skillContextTokens": null,
    "toolCalls": null,
    "humanInterventions": null,
    "recoveryAttempts": null
  },
  "failureModes": null,
  "human": null
}
```

For an assisted run use `"variant": "skill-assisted"` and set `skill.requested` to the named skill. Record observed skill names in `skill.loaded`, using `[]` only when the trace shows absence. `response` is the answer's JSON object. A missing or unparseable final answer uses `null` and the actual failure in `failureModes`. Known metrics use nonnegative integers, including zero for an observed none. Use `null` for unavailable values. Put the pinned subject checkout, Codex surface/version and isolation mode in `environment`. Keep the skill revision in the paired research evidence. A completed human review uses `{"verdict":"pass","evidence":"<observation>"}` with the applicable verdict.

Completion counts fields supplied. Correctness counts fields matching the rubric. List checks are order independent. Regression detection requires all case-specific detection fields to pass. Activation is determined from observed skill names. The comparison reports assisted-minus-control deltas only when both corresponding metrics are observed. `matched` requires equal recorded conditions, known control isolation and verified assisted activation. `unverified` marks missing evidence. `confounded` marks condition mismatch, divergent auxiliary skills, relevant control contamination or missed activation.

## Limits and research handoff

The same outputs may result from different reasoning. A correct claim score does not prove a safe correction, good design or durable recovery. Require human judgment for those aspects. The PSD fixture cannot verify a real application installation. The tenant fixture covers defensive reasoning over synthetic observations. Recorded contexts must establish what each solver could access. A small pilot supports descriptive comparisons. A credible general claim needs repeated runs across cases, consistent extraction, and documented confounders such as model drift, prior context and tool failures.

Attach the corpus revision and input hashes, run records, sanitized raw trace pointers, human rulings and any rerun decisions to the authorized Juno Research record. Keep missing observations explicit and distinguish software changes, synthetic checks and measured agent outcomes.
