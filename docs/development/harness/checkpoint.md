# Checkpoint receipt verification

Run the check from the exact clean task checkout. Save the receipt outside that checkout.

```sh
node scripts/harness/checkpoint.mjs <checkpoint.json>
pnpm exec vitest run scripts/harness/checkpoint.test.mjs
```

The receipt supplies the `task` ID, exact Git `base` and `head`, literal `reservedPaths`, and `checks`. A trailing slash reserves a directory. Other entries refer to an exact file. Each check needs a unique `name` and a `status` of `passed`, `failed` or `not-run`. Executed checks require the exact `head`, an observed integer `exitCode` and a nonempty `evidence` pointer. Unexecuted checks use null for the head and exit code. See the [handoff template](../agents/HANDOFF_TEMPLATE.md) for the human record.

Use the existing JUNO ID or append a lowercase work-package suffix, such as `JUNO-0028-teams`. Keep one checkpoint per execution. Include the owner, last acknowledgement, observed state, failures and next action in the same record or its linked evidence.

After interruption, retrieve the checkpoint from Agent 00, verify the task and worktree, and compare the current head and status before editing. Preserve uncommitted work and reconcile a mismatch with its owner. Use the receipt verifier when the recorded checkout is clean. Continue only the recorded next action within the confirmed reservation.

The command checks clean state, ancestry, declared path coverage and consistent receipts. Confirm the reservation with the coordinator and review the underlying check output. A valid receipt attests internal consistency. GitHub remains the source for task and PR disposition. See the [coordination protocol](../agents/PROTOCOL.md).
