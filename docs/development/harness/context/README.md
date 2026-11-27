# Task context and recovery packages

JUNO-0055 gives a coordinator a reproducible way to send a product task to a worker and resume it after interruption. The scheduler supplies one released task object. The coordinator chooses which sources to include immediately. The worker can retrieve the rest by exact Git object ID. The output is a portable UTF-8 JSON file; it requires a local Git checkout and Node.js 24.

## Assemble

From the repository root:

```sh
node scripts/harness/context/cli.mjs assemble docs/development/harness/context/examples/shell/task.json docs/development/harness/context/examples/shell/selection.json --budget 32000
node scripts/harness/context/audit.mjs
pnpm exec vitest run scripts/harness/context/context.test.mjs
```

The [mobile drawer example](examples/shell/task.json) and [interrupted settings example](examples/resume/task.json) are read-only workloads on `a75e7dcca90d4868302e0b558da29d48f643a4fe`. Each package carries the objective, permission boundaries, owner, writable reservations, requirements, acceptance criteria, validation, blockers and recovery instructions. Registry release and scheduler checks still govern whether an agent may act. Both examples use existing source and browser tests. The examples request no specialist skill because the role skills were published on separate PR revisions. When a task needs one, record its identifier in the envelope and supply the skill's independently pinned revision as a separate input package.

1. Verify the active registry release, graph dependencies and ownership. Take a single envelope from the graph. Keep any checkpoint, dependency pins, resources and estimate on that object. The assembler validates the fields it consumes; the scheduler validates graph state and eligibility.
2. Write a [selection](examples/shell/selection.json) with one literal path, reason and mode per entry. Choose `inline` for text needed immediately. Use `reference` for policies, ADRs, contracts, tests, source or skills that the worker can open when relevant. A declared directory allows selecting named files below it. Writable reservations alone grant no read disclosure. Review selected material for the intended audience before handing it off.
3. Set the byte cap on the entire serialized package, including the envelope, source descriptors, escaped text and final newline. On overflow the command exits nonzero with no package on stdout. Change the selection or explicitly change the budget. No relevant requirement is silently truncated.
4. Keep successful stdout outside the product checkout and transfer those exact bytes. For an on-demand source, read `git --no-replace-objects cat-file blob <blob-id>` in a checkout with the object available. A fresh worker must still read applicable session policies. Record separately which disclosures actually took place.

As an integration check, Agent 02 extracted the released JUNO-0055-context envelope from the scheduler intake at commit 30ea9b2 and assembled its two policy references on the specified main revision. The resulting package preserved the task ID and returned the pinned AGENTS.md (7,744 bytes) and ASSIGNMENTS.md (12,650 bytes) blobs.

The manifest includes the Git blob ID, byte size, mode and distinct reasons for each path. The assembler reads regular blobs at the pinned commit. Modified working files, symlinks and submodules are outside that source model. Invalid UTF-8 and files containing NUL can only be referenced. Missing objects, undeclared source paths and invalid inputs fail before package output. Repeated selections for the same path coalesce; inline takes precedence. Files at different paths retain their individual provenance.

## Resume after interruption

Use the checkpoint verifier from [PR #125, revision a0e0a39](https://github.com/oEnzoRibas/Juno/blob/a0e0a393b3e71d658fe29b55a6671cb49d087023/docs/development/harness/checkpoint.md) in a clean checkout at the claimed head. Preserve the input receipt and the verifier's stdout in a trusted evidence location. Its summary gives the task ID, base, head and counts; inspect each original check for its status and evidence before treating it as passed.

Create a notes file, for example:

```json
{
  "blockers": ["Independent exact-head review outstanding."],
  "nextSteps": ["Inspect the existing settings test and execute the missing locale assertion."]
}
```

```sh
node scripts/harness/context/recovery.mjs create package.json checkpoint-summary.json notes.json > handoff.json
node scripts/harness/context/recovery.mjs verify package.json checkpoint-summary.json handoff.json <trusted-sha256>
```

Use binary-preserving stdout redirection (POSIX shell or PowerShell 7.4+). Publish the SHA-256 printed to stderr to the authorized coordination record independently from the bundle. During recovery, reacquire the package and checkpoint summary through their original evidence channels. Verification compares exact package and handoff bytes, matches task and base, checks an envelope's checkpoint head when present, and reproduces the packed blockers and notes. A mismatch stops resumption. This verifies integrity against the trusted inputs; a supplied digest alone cannot authenticate the publisher. The checkpoint format in #125 supports unsuffixed JUNO IDs. A graph subtask requires a matching supported receipt before this recovery handoff can be verified.

## Context audit

At the pinned base the five session and ownership entry points named in the examples total **34,990 bytes**. This measures policy and registry text available to a fresh worker. The Codex session's actual loaded context, compaction, later disclosures, model tokens and cost were not instrumented.

| Product workload     | Nine selected files, fully read (bytes) | Source text initially inlined (bytes) | Complete initial JSON (bytes) | Cap (bytes) |
| -------------------- | --------------------------------------: | ------------------------------------: | ----------------------------: | ----------: |
| Mobile drawer        |                                  64,396 |                                 7,000 |                        11,052 |      32,000 |
| Interrupted settings |                                  55,975 |                                 7,090 |                        11,334 |      32,000 |

The audit reads immutable Git objects, compares the whole task envelope, checks coverage of all nine declared inputs in each workload, and verifies each inlined source against Git. The full-read comparator counts raw source bytes only; the JSON figure includes the envelope, file identities and reasons. Subsequent disclosure can consume the entire difference. These cases establish packet size and retention of declared inputs. They do not measure worker accuracy, selection completeness for other tasks or productivity.

In a separate local recovery rehearsal, the pinned #125 verifier ran on an isolated clean checkout with matching base and head and an empty check list. Its summary had zero touched paths and zero check receipts. The interrupted settings package and notes round-tripped through create and verify. This exercised interruption handoff mechanics without claiming a product test result. Regression cases also alter the context, evidence head, notes and trusted digest.

## Design evidence

The project uses explicit references for progressive disclosure and keeps compact state for recovery. Anthropic's engineering report discusses retrieving context when needed and carrying structured notes between sessions. Liu et al. found position-dependent retrieval performance in controlled long-context tasks; that finding supports testing retention separately from size. Neither publication evaluated this Juno implementation. Sources consulted 2026-11-26. [Anthropic engineering, September 2025](https://www.anthropic.com/research/effective-context-engineering-for-ai-agents) · [Liu et al., July 2023 preprint](https://arxiv.org/abs/2307.03172) · [Git ls-tree reference](https://git-scm.com/docs/git-ls-tree)
