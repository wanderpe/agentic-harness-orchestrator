---
name: prepare-release
description: "Use when an orchestrated task is ready for release review or the user asks to commit, push, deploy, or ship verified changes."
---

# Prepare and execute an authorized release

Read [checkpoint protocol](../orchestrate-task/references/checkpoints.md) and [artifact rules](../orchestrate-task/references/artifacts.md). Inspect the actual scoped diff/content identity, unresolved findings, review and QA evidence, and unrelated dirty work. Complete authorized reversible preparation and checks before requesting any missing approval.

Present the concrete change scope, observed verification, intended operation, exact revision/content identity and destination. Reuse valid authorization already provided for that same scope and target. Commit, push, deployment or publication requires explicit authorization covering the operation and concrete destination; ask only for missing elements. Any content change makes prior evidence and approval stale. A report's approval boolean or a branch candidate is insufficient.

Use available host operations to release only the approved scope, preserving unrelated work. After commit capture the exact commit; after push verify the remote ref; after deployment verify the actual endpoint when tools permit. Report failures and unverified outcomes precisely and stop dependent release actions. Write RELEASE_REPORT.md using the contract headings, distinguishing prepared, committed, pushed, deployed and verified. Update project memory only if explicitly requested or separately authorized by the applicable task instructions; never write the assistant's personal memory without the user's explicit request. Do not send handoff messages to other people unless explicitly instructed.


Before declaring release readiness, follow [risk and evidence policy](../orchestrate-task/references/risk-policy.md) and run the release check from [evidence gate](../orchestrate-task/references/evidence-gate.md) when executable. Keep required NOT_RUN checks visible and readiness incomplete. Compare the complete working/staged diff and relevant untracked files against approved scope; a declared-scope hash does not establish scope completeness. Verify approval provenance against the actual conversation even when the helper returns ok. For a multi-operation release, record and validate authorization for each concrete operation/target. Recheck current contents immediately before the operation. With no execution tools, report manual checks and their limits precisely.


Use the installed [verification-before-completion](../verification-before-completion/SKILL.md) technique to match release-readiness claims to observed evidence. It supplies no additional release authorization.

