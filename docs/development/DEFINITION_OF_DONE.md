# Definition of done

A task may move to COMPLETED only when the implementation and evidence meet every applicable requirement.

- All mandatory acceptance criteria are satisfied. Implementation and meaningful source documentation are complete.
- Affected technical documentation is current, including contracts, runbooks, migrations, and known limitations. Record significant decisions in ADRs. Update the changelog when appropriate.
- Required automated tests exist and passed. Record commands, environment, results, and unresolved failures. Explain inapplicable checks.
- Review security and privacy. Validate tenant isolation and authorization where applicable. Evaluate accessibility and internationalization where applicable.
- Update the task record, state, worklog, and live queue. Add the terminal task to the history index. Persist the next eligible action and any remaining approvals.
- Record actual branch, base, commit, review, CI and merge evidence when the [Git workflow](git-workflow.md) applies. An open pull request remains in a review state.
- Resolve critical validation failures. When a mandatory check cannot run, retain an appropriate incomplete or BLOCKED state with the reason and resumption condition.

Use the [quality gate plan](../testing/README.md) to select checks. Documentation-only work requires documentation and repository checks. Runtime verification applies when the task produces runtime behavior.


## Ready for maintainer review

The description satisfies the [maintainer review standard](git-workflow.md#maintainer-review-standard). Relevant visual evidence is visible on GitHub. Checkout and validation steps are reproducible on pinned revisions with synthetic fixtures. CI, local and human outcomes are separately identified. Pending policy, unmet dependencies, and failing checks remain explicit. Passing technical checks do not establish human acceptance.


## Issue traceability

Verify the development task, corresponding issue, PR association in both directions and accurate labels. Close an issue only after the complete recorded scope and its applicable approval are verified. A merged increment can leave its parent task open. Follow the [traceability workflow](git-workflow.md#issue-and-pr-traceability).
