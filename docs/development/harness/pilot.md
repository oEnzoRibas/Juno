# First matched-input harness pilot

On 2026-11-26 two fresh Codex app-server sessions received the same synthetic `sql-fixture-coverage` task. The evaluator used corpus revision `b909ba79e23fd4eccb6577d238b8b7638b259ab9` and input SHA-256 `a36dc23f5863f599168da9ccc0653d0e1d0e87545330d12eee6cc47835a363a1`. Both used CLI 0.169.1 on Windows, GPT-6.2 Sol with medium reasoning, a read-only session, disabled web search and the same isolated workflow checkout. The solver read only the task input with the engine-managed skill attachment in the assisted arm. The runtime emitted no separate skill-load event for the two scored turns.

| Observation                                     | Control     | Explicit skill attachment |
| ----------------------------------------------- | ----------- | ------------------------- |
| Exact answers matching the deterministic rubric | 4/4         | 4/4                       |
| Missing and duplicate fixture identified        | Yes         | Yes                       |
| Turn duration observed by the local client      | 4,125 ms    | 3,169 ms                  |
| Input / output tokens reported by the surface   | 17,787 / 42 | 19,043 / 42               |
| Completed tool calls and human interventions    | 0 / 0       | 0 / 0                     |
| Skill-only context tokens and human assessment  | Unavailable | Unavailable               |

The [control](evidence/pilot/control.json) and [assisted](evidence/pilot/skill-assisted.json) records preserve the actual answers. Both named `organization-profile.sql` as missing and `member-directory.sql` as duplicated. Both kept maintainer acceptance pending. The comparison is **unverified for observed activation within the scored turns**. The single pair supports no inference about improvement, latency or cost.

## Explicit invocation probe

The actual app-server discovered and enabled the repository skill `juno-pull-request`. With the same probe prompt and no tool calls, the [unattached probe](evidence/pilot/invocation-control.json) answered `unavailable` and the [attached probe](evidence/pilot/invocation-assisted.json) reproduced a verbatim sentence present only in the skill body. This verifies native explicit delivery for that probe. The skill text tested was version 1.0.0, source SHA-256 `931366f4d6d194caecbb9ed21f81b85bd8f481a2685f88970935b53702031bca`. The probe is separate from the scored task. Automatic matching was not tested.

An initial pair used a text-only CLI request. The platform rejected the requested PowerShell skill read under the existing policy. Both answers were correct, but the assisted arm lacked verified skill delivery and the evaluator marks the pair confounded. The [control](evidence/pilot/cli-control.json) and [failed-treatment record](evidence/pilot/cli-assistance-confounded.json) preserve the original responses and counters. The follow-up used the supported structured skill input without changing filesystem permissions.

## Reproduction

Use the [matched-run methodology](evaluation.md#matched-runs) and a checkout containing the named skill. Run `node scripts/harness/eval/cli.mjs input sql-fixture-coverage` from a separate grader checkout. Supply the same returned case to two fresh read-only sessions. In the structured variant, use Codex app-server `skills/list` to confirm the enabled repository skill, then add a `type: "skill"` input with its name and actual local path to the assisted `turn/start`. The control receives the same text alone. Record the actual `thread/tokenUsage/updated` totals and completed turn, redact local paths and retain any errors. Keep evaluator ground truth outside both solving sessions. See the [Codex App Server protocol](https://learn.chatgpt.com/docs/app-server).

```powershell
node scripts/harness/eval/cli.mjs compare docs/development/harness/evidence/pilot/control.json docs/development/harness/evidence/pilot/skill-assisted.json
```

The raw response objects and relevant observations are preserved in these sanitized records. Full machine-specific logs stay local. The independent [Research checkpoint](https://github.com/oEnzoRibas/juno-research/pull/10) records the separate pre-intervention baseline and experimental design.
