# Gamification, activity, and virtual economy

**Status:** Proposed. The relationship between experience points (XP) and redeemable currency requires owner approval before implementing either award model.

## Activity and progression

- Record a tenant, member or team, source type and stable source ID, rule version, qualifying decision, attribution, and timestamp for every award. Allow approved reports, validated GitHub activity, challenges, training, events, mentoring, knowledge sharing, and manual recognition as separate sources.
- Evaluate rules against validated activity. Propose one award per tenant, source, recipient, and eligible reward rule unless a published rule defines repeat eligibility. Replays must produce the same result for the same event. Decide explicitly how edits, reopened reviews, and rule changes affect historical outcomes.
- Propose XP as non-spendable progression and currency as spending power. A rule could grant XP, currency, both, or neither with separate records. Settle level thresholds, historical recalculation, expiry and whether currency and XP can ever be converted before implementation. No conversion is the initial proposal.
- Show the source, rule, amount, and status of awards. Use reasoned, auditable adjustments for corrections. Offer tenant-configurable leaderboard participation, visibility and tie rules. Evaluate recognition quality and equitable opportunities across roles.

## Challenge and report review

Proposed lifecycle for a challenge submission is registered → submitted → approved or rejected, with eligibility and timestamps evaluated in the tenant's configured time zone. Report review follows draft → submitted → approved or rejected. Preserve each decision, reviewer, and feedback. Define resubmission and appeal rules before shipping. Only a committed qualifying decision may create an award, subject to permission and duplicate checks.

## Ledger and redemption

- Store currency amounts as integer units with tenant and account scope. An auditable ledger records credits, debits, and compensating entries. Cached balances must reconcile to ledger entries. Only authorized adjustments with reasons can change spendable value.
- A redemption must atomically check the authoritative balance and inventory and write the debit or reservation, inventory change, redemption record, and idempotency outcome. Equivalent retries return the original result. Conflicting reuse of a key is rejected.
- Proposed states are requested, approved, fulfilled, and canceled. Decide between holding funds at request and spending funds at approval, and define which transitions return stock or release funds. A cancellation uses a compensating entry when a debit has posted. Audit the actor and reason and forbid a second reversal of the same debit.
- The currency is internal, nonfinancial, and tenant-specific. Test concurrent requests for the last item, retries after timeouts, insufficient balance, and cancellation races.

See the [decision register](decisions.md), the [validation strategy](../testing/README.md), and the [durable domain events proposal](../architecture/adr/0004-durable-domain-events.md).
