# Checkpoint receipt verification

Run the check from the exact clean task checkout. Save the receipt outside that checkout.

```sh
node scripts/harness/checkpoint.mjs <checkpoint.json>
node --test scripts/harness/checkpoint.test.mjs
```

The receipt supplies the `task` ID, exact Git `base` and `head`, literal `reservedPaths`, and `checks`. A trailing slash reserves a directory. Other entries refer to an exact file. Each check needs a unique `name` and a `status` of `passed`, `failed` or `not-run`. Executed checks require the exact `head`, an observed integer `exitCode` and a nonempty `evidence` pointer. Unexecuted checks use null for the head and exit code. See the [handoff template](../agents/HANDOFF_TEMPLATE.md) for the human record.

The command checks clean state, ancestry, declared path coverage and consistent receipts. It does not assign work, verify remote availability, execute checks or attest their truth. Confirm the reservation against the authoritative registry and review the real evidence. On failure preserve the stated checkpoint and reconcile the specific discrepancy.
