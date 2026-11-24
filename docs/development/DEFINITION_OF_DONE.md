# Definition of done

A task may move to COMPLETED only when the implementation and evidence meet every applicable requirement.

- All mandatory acceptance criteria are satisfied. Implementation and meaningful source documentation are complete.
- Affected technical documentation is current, including contracts, runbooks, migrations, and known limitations. Record significant decisions in ADRs. Update the changelog when appropriate.
- Required automated tests exist and passed. Record commands, environment, results, and unresolved failures. Explain inapplicable checks.
- Review security and privacy. Validate tenant isolation and authorization where applicable. Evaluate accessibility and internationalization where applicable.
- Update the task record, state, worklog, and live queue. Add the terminal task to the history index. Persist the next eligible action and any remaining approvals.
- Record actual branch, base, commit, review, CI and merge evidence when the Git workflow applies. An open pull request remains in a review state.
- Resolve critical validation failures. When a mandatory check cannot run, retain an appropriate incomplete or BLOCKED state with the reason and resumption condition.

Use the [quality gate plan](../testing/README.md) to select checks. Documentation-only work requires documentation and repository checks. Runtime verification applies when the task produces runtime behavior.
