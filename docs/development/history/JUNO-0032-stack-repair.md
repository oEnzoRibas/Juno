# JUNO-0032 — Phase 1 stack maintenance

The owner asked to review the conflicts at and after PR #21 and add GitHub repository tags. Repository tags were interpreted as GitHub topics since the request provided no release version.

GitHub had merged #20 and retargeted #21 to `main`. Main at `8d7718e8a77d21aa569f5632ab0703d2afd7b212` had the same tree as the old #21 parent, `4d06588632cdeacaa0ea838b76d559e507c191a2`, but different ancestry. Replaying only #21 and #22 retained both trees, per-layer binary patches, authors, author dates and commit messages. Exact per-branch force-with-lease guards and an atomic push protected both updates.

| PR | Previous head | Replayed head | Local recovery reference |
| --- | --- | --- | --- |
| [#21](https://github.com/oEnzoRibas/Juno/pull/21) | `020fecbefad9a63bbf6623c71adda7a1c2ae1f63` | `2e665a43ebea7762a34dcc4a3a2396afe56afd33` | `refs/juno-recovery/20261124T161757Z/pr-21` |
| [#22](https://github.com/oEnzoRibas/Juno/pull/22) | `17442258b2861d42e2bb2d6ce8a85324821cfa87` | `8eb5be542de0e72de8e377978434d8465a45eb4b` | `refs/juno-recovery/20261124T161757Z/pr-22` |

A subsequent normal push of `3e7051ee50c54bdfb4d5780e6eb4c4d126ec965a` fixes Vitest discovery of generated build output in #22. GitHub confirmed #22 joined [stack #14](https://github.com/oEnzoRibas/Juno/stack/14).

Verified topics through the GitHub API: `docker-compose`, `gamification`, `junior-enterprise`, `multi-tenant`, `nestjs`, `nextjs`, `open-source`, `postgresql`, `self-hosted`, `typescript`.

Run under the owner's previous stack maintenance authorization. No merges or main updates were performed during this repair.
