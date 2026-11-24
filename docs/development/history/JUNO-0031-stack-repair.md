# JUNO-0031 stack maintenance record

On 2026-11-24, PR #11's new tip had the same tree as its former tip but different ancestry after an earlier native stack update. PR #12 still descended from the former tip. Its merge-base view therefore included patch-equivalent lower layers.

The owner authorized repair as a dependency-driven FIFO exception. The official extension supports cascading rebases and atomic pushes. A bounded replay was used to restrict updates to #12 and its six descendants and to check the actual remote SHA for every lease. Each layer replayed its two original commits in order. Its final tree, binary incremental patch, author identity, author timestamp, and commit message were identical to the original. Local recovery refs preserve every prior tip. All seven pushes were atomic with explicit leases. Main stayed unchanged and GitHub reported 22 files and two commits in #12 before it was marked Ready.

| PR | Previous head | Repaired head | Local recovery ref | Paths |
| --- | --- | --- | --- | --- |
| #12 | `1a1ab893980fe492fa9b2a9b746c3afae6e9e391` | `0036f768e3d0660257756bb8e92dc9a8380c53eb` | `refs/juno-recovery/20261124T160654Z/pr-12` | 22 |
| #13 | `3c8d1b9f42f9b94a073ffbad4d1cf9950f32eba2` | `c2c2c9b4f58069fcc537234468ad45980087ef79` | `refs/juno-recovery/20261124T160654Z/pr-13` | 56 |
| #15 | `2a3110d1d1f3e0543d2a6d91f8258f7cc09c678e` | `b68e9ab828dcc7d0161239312bfac6166515bfd1` | `refs/juno-recovery/20261124T160654Z/pr-15` | 21 |
| #16 | `824d40c007f6a889f0e12176c8f94494ed04990e` | `dce966c67ffeca97f742f647f43eac38e62dbc5b` | `refs/juno-recovery/20261124T160654Z/pr-16` | 13 |
| #17 | `4c4eb656b12e4c80c3a965a60843197fb16c3caa` | `7aa39611df78befaf06ce6b0a24a0c1f87d1e770` | `refs/juno-recovery/20261124T160654Z/pr-17` | 6 |
| #18 | `63e7888e362aaaf3ba51480a56cfcb6d1a89afc0` | `6ce3c5f0ee69231624852727400ff9c4acfcfab5` | `refs/juno-recovery/20261124T160654Z/pr-18` | 29 |
| #19 | `e53defc1f6c2f5d47c85aada22fa34bf9602f97a` | `1aba12f4b6c11ca322dfb179bee1d1489e7b894e` | `refs/juno-recovery/20261124T160654Z/pr-19` | 22 |
