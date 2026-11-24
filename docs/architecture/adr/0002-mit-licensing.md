# ADR 0002 — MIT licensing for Juno

**Status:** Accepted by project creator Enzo Ribas for project initialization.

**SPDX identifier:** `MIT`

**Copyright:** Copyright (c) 2026 Enzo Ribas

## Context and decision

Juno serves Junior Enterprises with different budgets, infrastructure, and technical experience. Broad permissions support adoption, education, experimentation, contributions, forks, and independently operated deployments. Use the MIT License for Juno software and associated project documentation. Preserve its full permission and warranty provisions in the [root license](../../../LICENSE). [Open Source Initiative license text](https://opensource.org/license/mit)

| Alternative | Trade-off |
| --- | --- |
| MIT | Broad reuse and simple notice preservation support adoption. Private and commercial derivatives are permitted. |
| GNU AGPL v3.0 | Network copyleft extends corresponding-source obligations to certain network use of modified versions. This adds obligations the creator chose to avoid. Superseded draft proposal. |
| GNU GPL | Copyleft preserves source-sharing obligations on covered distribution, with additional conditions. Superseded alternative. |
| PolyForm Noncommercial and restrictive source-available terms | Usage restrictions would conflict with the adoption and reuse goals. Superseded alternatives. |

## Consequences

MIT permits commercial use, redistribution, modification, private use, and proprietary derivatives. Preserve the notices in copies or substantial portions. Contributors retain their rights to their original work. Third-party terms and notices continue to apply. Use `MIT` when package manifests and distribution metadata are introduced.

Access to core functionality is a commitment of the official project. The proposed [brand policy](../../../TRADEMARKS.md) addresses project identity and affiliation. Any separate asset terms need an explicit scope and must preserve MIT software permissions.

## Release verification

At the time of this review, the public GitHub origin advertised only `main` at `23689f7` and no tags. That commit tracks only `.gitattributes`. The earlier AGPL text was a local proposal. The current repository and advertised refs provide no evidence of an earlier licensed release. They cannot establish whether a copy was shared elsewhere. If evidence of an earlier release under another license appears, document the affected versions and contributions, preserve previously granted rights, and obtain human review before relicensing affected contributions.
