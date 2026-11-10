---
name: review-changes
description: "Use when the user requests a read-only code review, diff review, or a walkthrough of existing behavior."
---

# Review changes

Establish the precise files, branch comparison or diff and intended behavior. Read the common [role contracts](../orchestrate-task/references/roles.md) and [artifact rules](../orchestrate-task/references/artifacts.md). Trace affected callers and data flow against actual source and repository conventions. For frontend work inspect server/client boundaries, state and URL synchronization, accessibility, localization, responsiveness and failure states as relevant.

Keep source unchanged. Follow the requested review scope; execute automated suites only when requested for a standalone review. Distinguish observed defects, supported risks and unknowns. Report each actionable finding with severity, path/line, triggering conditions, user impact and a concrete remedy. Explain the actual execution flow when requested. Record the reviewed content identity. If artifacts can be saved, write CODE_REVIEW.md inside the authorized task directory; otherwise deliver it in chat. A PASS concerns review findings and does not imply tests ran. Do not silently switch into implementation.


Record whether the review was independent or sequential self-review, the inspected file scope and the current content identity. Keep review findings distinct from executed test results. A modified diff requires a fresh review. Apply [risk and evidence policy](../orchestrate-task/references/risk-policy.md) proportionally; an unavailable required independent review remains an explicit gap.


For a review-completion claim, consult [verification-before-completion](../verification-before-completion/SKILL.md), preserving this route's read-only and test-execution boundaries.

