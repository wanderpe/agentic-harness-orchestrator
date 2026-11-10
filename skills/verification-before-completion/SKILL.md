---
name: verification-before-completion
description: "Use before a harness success claim, completion handoff, or release-readiness decision to ensure it is supported by current, appropriate evidence."
---

# Verification before completion — harness edition

Adapted from the MIT-licensed obra/superpowers skill. See [source and adaptation notice](../../THIRD_PARTY_NOTICES.md).

1. Identify the exact claim and the command, test, comparison, or independent measurement that can establish it. Match proof to claim: lint does not prove a build, a passing build does not prove requirements, and a worker's report does not establish verified completion.
2. Inspect existing evidence for scope, content identity, command/procedure, exit status where applicable, actor and observed time. Reuse it only if it still applies to the current files and relevant environment. Rerun when content/environment changed, evidence is incomplete, or the applicable workflow requires a fresh check; routine status messages alone do not invalidate evidence.
3. Execute authorized missing checks where tools exist and read their actual outcome. Follow [risk policy](../orchestrate-task/references/risk-policy.md) and the task's required checks. Required unavailable checks stay NOT_RUN and readiness incomplete. For review-only requests preserve the restriction on unsolicited automated suites.
4. Compare results to each acceptance criterion and state unresolved limitations. Inspect delegated work's actual diff and artifacts; label sequential self-review honestly. Prefer an external oracle such as a regression test, measured benchmark, compiler, schema check or independently captured observation.
5. Use [evidence gate](../orchestrate-task/references/evidence-gate.md) where supported, while recognizing its limits. Its passing result validates records; it cannot authenticate approval, a human identity or the correctness of a test design.
6. Report only the verified claim and its practical limits. Distinguish implemented, reviewed, tested, ready, committed, pushed and deployed. Changes after validation invalidate dependent conclusions. Use [prepare-release](../prepare-release/SKILL.md) for release operations; verification itself grants no release authority.

