# Local Photoshop proof (JUNO-0052)

From a Windows checkout with desktop Photoshop accessible to the signed-in operator, run:

```powershell
./scripts/harness/photoshop/Invoke-Proof.ps1 -OutputDirectory (Resolve-Path .)
```

Select an existing creative output directory outside the checkout for regular use. The command above creates a unique local proof directory containing a native PSD, transparent PNG and inspection JSON. Inspect the Study group in Photoshop. Toggle Beacon independently and inspect the Body vector mask, gradient clipping and construction path. Every run uses its own documents and restores the previous active document and preferences.

## Observed

Photoshop 2027 executable 28.0 (20261027.r.20), COM application 28.0.0. Local PowerShell invoked fixed JSX through Photoshop.Application.DoJavaScript. Two native reopens verified an sRGB 384 × 384 RGB document, named solid fill and gradient fill, saved triangle path, clipped gradient and embedded Smart Object. With Body selected before saving, hidden Beacon persisted on the first reopen. The second reopen retained its visibility change and 18 px translation. Earlier proof iterations caught a profile mismatch dialog and a hidden-state mismatch. Scope dialog suppression to the run and restore the prior setting. The inspection JSON records the actual PSD and PNG SHA-256 values.

## Boundaries and alternatives

The local application executed without a purchase or cloud call. Account subscription terms and Firefly credit entitlement were not inspected. The proof uses the local ExtendScript DOM and action descriptors. Adobe also documents standalone PSJS, DOM and batchPlay on supported versions; interactive UXP script execution and plugin debugging were not exercised. UXP Developer Tool was not listed in Start apps. Windows GUI interaction was available for a profile prompt. No MCP server or plugin is required for this round trip. PSD and PNG were tested. Other format availability should be evaluated against an actual export.

[Adobe UXP scripting](https://developer.adobe.com/photoshop/uxp/ps_reference/media/uxpscripting/) · [Adobe batchPlay](https://developer.adobe.com/photoshop/uxp/ps_reference/media/batchplay/)

Agent 02 used Codex to author and run the local proof. Synthetic geometry has no external artwork dependency.

## Cleanup correction and regression evidence

After synchronization with main c83a5469bd6250ffab595cee1653740db308c1e1, the PowerShell runner loads the fixed local cleanup helper before the proof. The helper attempts proof close, ruler-unit restoration, dialog restoration and the initial active-document selection independently. Each failure is retained in an error report; an earlier proof failure is included when cleanup also fails. It only attempts to close the document created by the proof. Existing user documents are never closed or saved by cleanup.

Eight Node/Vitest cases exercise normal restoration, each individual failure, simultaneous failures, a create interrupted before a document exists and retention of the original proof error. They execute the actual JSX helper in a sandbox with mock Photoshop objects. Full repository tests passed (52 cases). An initial empty-array parameterization failed in the test runner and was corrected to named case objects before the final pass.

The fresh native proof on this corrected revision was blocked by automatic execution approval review. The stated risk was that COM changes application preferences and opens, saves and closes documents while the reviewer could not establish authorization for the live operation. The saved native Photoshop 28.0.0 receipts above belong to the original implementation. They establish the original document round trip. They do not qualify the new cleanup helper against live Photoshop failures. Repeat the bounded PowerShell command in an authorized desktop session to close this gate.
