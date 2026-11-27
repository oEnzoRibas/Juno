---
name: photoshop-automation
description: Operate a locally installed Photoshop to build and verify layered PSD artwork through the tested Windows COM and JSX workflow.
---

# Local Photoshop automation

Start with the bounded round trip in `scripts/harness/photoshop/Invoke-Proof.ps1`. Pass an existing authorized creative workspace. Each run creates a fresh directory. Read `docs/development/harness/photoshop.md` for observed capabilities. Inspect named layers after a real reopen, edit one component and verify that the change persisted. Copy previews separately from editable sources. Preserve user documents, ruler units and dialog preferences. Leave artwork visible when the maintainer requests it. Record failures before changing scripting mechanisms.
