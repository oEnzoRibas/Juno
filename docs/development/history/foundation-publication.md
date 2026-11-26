# Phase 0 foundation publication

**Task:** [JUNO-0003](../tasks/JUNO-0003.md).
**Destination:** [oEnzoRibas/Juno](https://github.com/oEnzoRibas/Juno).
**Baseline:** `main` at `23689f7`, with only `.gitattributes` tracked before foundation publication.

The local foundation predates the Git protocol and has interlinked documents. Publish focused increments as an explicit stack. Add relative links as their targets become available. Each PR compares against its immediate parent so reviewers see only the new responsibility. Retarget after the parent is merged and verify the diff, particularly if the merge was squashed. Stock diagrams and brand binaries supplied by the owner are distinct from generated exports. CI and runtime delivery are separate future scopes.

| Order | Scope                                             | Branch                                |
| ----- | ------------------------------------------------- | ------------------------------------- |
| 1     | MIT and creator credit                            | `docs/juno-0003-mit-license`          |
| 2     | Community governance and issue workflows          | `docs/juno-0003-community-governance` |
| 3     | AI transparency                                   | `docs/juno-0003-ai-disclosure`        |
| 4     | FIFO method and task history                      | `docs/juno-0001-development-protocol` |
| 5     | Product requirements and roadmap                  | `docs/juno-0003-product-foundation`   |
| 6     | Architecture, boundaries and validation proposals | `docs/juno-0001-system-architecture`  |
| 7     | Official assets and brand guidance                | `docs/juno-0002-brand-assets`         |
| 8     | Accessibility and design system                   | `docs/juno-0003-design-system`        |
| 9     | Editable architecture diagrams and exports        | `docs/juno-0002-visual-architecture`  |
| 10    | Approved Docker architecture and deployment plans | `infra/juno-0002-docker-foundation`   |
| 11    | Git rules, PR template, and integrated onboarding | `docs/juno-0003-git-workflow`         |

Actual commits, PR URLs, reviews and CI are recorded after publication.

## Verified branches, commits and pull requests

Verified on 2026-11-24. All PRs are open. No CI runs or human reviews were reported at verification. The first PR is ready; all dependent PRs are drafts.

| PR                                                | Branch                                | Base                                  | Initial commit                             | State |
| ------------------------------------------------- | ------------------------------------- | ------------------------------------- | ------------------------------------------ | ----- |
| [#1](https://github.com/oEnzoRibas/Juno/pull/1)   | `docs/juno-0003-mit-license`          | `main`                                | `3cae76b847cb39c147ac84d0cfb7cbe7eff3c9c2` | Ready |
| [#2](https://github.com/oEnzoRibas/Juno/pull/2)   | `docs/juno-0003-community-governance` | `docs/juno-0003-mit-license`          | `a595340d1f1f6617fc9bcb1dcac215c870ba38dd` | Draft |
| [#3](https://github.com/oEnzoRibas/Juno/pull/3)   | `docs/juno-0003-ai-disclosure`        | `docs/juno-0003-community-governance` | `bdc1b4431d1ee4ebbe685c46e5089389daf2d434` | Draft |
| [#4](https://github.com/oEnzoRibas/Juno/pull/4)   | `docs/juno-0001-development-protocol` | `docs/juno-0003-ai-disclosure`        | `1fc00921e359fcd5f8b54f8007a7c51239db1175` | Draft |
| [#5](https://github.com/oEnzoRibas/Juno/pull/5)   | `docs/juno-0003-product-foundation`   | `docs/juno-0001-development-protocol` | `49c1ec30fc58a2a0f6f15b22f31fcd9c3bd29557` | Draft |
| [#6](https://github.com/oEnzoRibas/Juno/pull/6)   | `docs/juno-0001-system-architecture`  | `docs/juno-0003-product-foundation`   | `ee8167320d95dd50e42142dd893adb6bef5977c2` | Draft |
| [#7](https://github.com/oEnzoRibas/Juno/pull/7)   | `docs/juno-0002-brand-assets`         | `docs/juno-0001-system-architecture`  | `d1353c16bfdc80e1717656ce18715325c08a9716` | Draft |
| [#8](https://github.com/oEnzoRibas/Juno/pull/8)   | `docs/juno-0003-design-system`        | `docs/juno-0002-brand-assets`         | `98778c00a4d3e33ec9d0423ebe132699370b0aa1` | Draft |
| [#9](https://github.com/oEnzoRibas/Juno/pull/9)   | `docs/juno-0002-visual-architecture`  | `docs/juno-0003-design-system`        | `deac5ff7d5db4aa42a16a7f9bf9b06f88b055f80` | Draft |
| [#10](https://github.com/oEnzoRibas/Juno/pull/10) | `infra/juno-0002-docker-foundation`   | `docs/juno-0002-visual-architecture`  | `f425cdbdcdea2e9800cb9fff2fbd460a79dcb3e5` | Draft |
| [#11](https://github.com/oEnzoRibas/Juno/pull/11) | `docs/juno-0003-git-workflow`         | `infra/juno-0002-docker-foundation`   | `32110e58ece7322d92f6006b44f9ea4dcfc6f6dc` | Draft |
