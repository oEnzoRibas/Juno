# Frontend skills

JUNO-0049 provides two repository-scoped entry points for Agent 02. Open a trusted checkout containing these files in Codex. The skill picker can select either skill explicitly.

| Request                                           | Skill                                                                        | Expected evidence                                                                                |
| ------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Extend a Juno member form                         | [`$juno-design-system`](../../../.agents/skills/juno-design-system/SKILL.md) | Existing production primitive, server capability, translated feedback and regression test        |
| Review a drawer where opening Account loses focus | [`$juno-visual-qa`](../../../.agents/skills/juno-visual-qa/SKILL.md)         | Candidate revision, keyboard sequence, viewport and observed focus target                        |
| Compare candidate mascot exports at 32 px         | `$juno-visual-qa`                                                            | Small-size silhouettes, alpha edges, light and dark samples and an explicit human selection gate |

Implementation may lead to a separate visual review. A backend-only migration has no frontend skill requirement. Character creation and Photoshop automation have separate ownership. The QA skill inspects their outputs.

## Reproduce discovery

Start a fresh Codex session in this checkout and open its skill picker. Select each named entry and use the corresponding example above. A read-only review can stop at findings. Publishing evidence or changing application code follows the assignment's scope.

For a protocol-level discovery check, start `codex app-server --stdio`, send `initialize` and `initialized`, then request `skills/list` with this checkout's absolute path in `cwds` and `forceReload: true`. Both entries should be enabled and resolve under this checkout's `.agents/skills`. Sibling checkouts on revisions that lack these skills should have no corresponding repository entries.

## Observed validation

On 2026-11-26, Codex CLI 0.169.1 returned both enabled entries from this checkout and zero matches from an empty control directory. Two ephemeral read-only sessions received separate explicit `turn/start` inputs of type `skill` with the selected name and absolute `SKILL.md` path. An IPv4 loopback recorder found the complete selected body in each outgoing Responses request and no body from the other skill. The recorder returned an empty completion. This exercises discovery and context delivery without model inference, credentials, plugin installation or a hosted API. Model routing quality and human acceptance remain separate evaluations.

Juno — Original project creator: Enzo Ribas. Developed with AI assistance.
