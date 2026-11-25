# Open decisions and limitations

| Decision | Proposed reviewer | Resolve before |
| --- | --- | --- |
| Verify third-party notices and artwork provenance. Confirm the production masters and review the proposed brand usage policy and any separately licensed asset scope. | Project owner | Public release |
| Confirm a private vulnerability channel, conduct escalation, maintainers, merge rules, and release responsibilities. | Project owner | Public release |
| Identify the first tenant workflow and validate organization structures, manager delegation, and support expectations against representative Junior Enterprises. | Product lead with tenant representatives | Phase 1 specification acceptance |
| Confirm deployment baseline, identity provider or local auth strategy, tenant resolution, account recovery, privileged access, and tenant provisioning approvals. | Architecture and security reviewers | Platform implementation |
| Decide tenant export, retention, deletion, controller and processor responsibilities, analytics visibility, and minimum cohorts. | Product owner and privacy reviewer | Collection of real member data or publication of analytics |
| Confirm whether XP and currency can interact, how rule versions apply, and leaderboard visibility and participation defaults. | Product owner | Gamification engine implementation |
| Define review delegation, appeals, resubmission, and what happens when approvals are revoked or evidence changes. | Product lead | Challenges and reports |
| Confirm supported GitHub Projects operations, installation mapping, identity claims, scope, and retention of provider data after disconnect. | Integration and security reviewers | GitHub integration |
| Define currency reservation, expiry, redemption cancellation, fulfillment, and stock reconciliation. | Product and architecture reviewers | Virtual economy implementation |
| Define learning completion evidence, manual alternatives, and when rewards are issued. | Product lead | Learning implementation |
| Approve theme token mappings, typography and tenant override behavior. Assign localization ownership and confirm accessibility validation for the first interfaces. | Design and accessibility reviewers | First tenant-facing UI |
| Agree on availability, retention, incident reporting, recovery objectives, and operator responsibilities. | Operations and privacy reviewers | First deployment handling member data |

See [architecture decision candidates](../architecture/decision-candidates.md) for topology, tenancy, identity, platform tooling and approval evidence.

Role names identify review responsibilities and may be held by the same person during Phase 0. This repository has no runnable application, migrations, published API, environment settings, or live integrations. Maintain a technical debt record as soon as a deliberate implementation compromise is accepted. Record the consequence, owner, trigger for revisiting it, and removal criteria.

The [membership lifecycle decision brief](membership-lifecycle-decisions.md) records the pending reactivation, final administrator, delegation and retention choices.
