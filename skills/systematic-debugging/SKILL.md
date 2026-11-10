---
name: systematic-debugging
description: "Use when a harness task has a bug, failing check, intermittent failure, or performance regression that needs causal investigation before repair."
---

# Systematic debugging — harness edition

Adapted from the MIT-licensed obra/superpowers skill. See [source and adaptation notice](../../THIRD_PARTY_NOTICES.md).

1. State expected behavior, actual behavior, triggering conditions and the observable failure. Read the complete relevant error and inspect recent changes. Obtain a small reproduction, or describe the available evidence and its limits without claiming reproduction.
2. Trace the failing value through callers and component boundaries to the responsible layer. Compare a working local example and relevant configuration. Gather narrowly scoped diagnostics without exposing secrets or changing unrelated behavior.
3. Form one falsifiable hypothesis with a predicted result. Test the smallest distinguishing change or probe. Record the observed outcome; a failed prediction revises the hypothesis rather than justifying another speculative patch.
4. Apply the smallest causal fix. Use an appropriate regression check before/after where feasible, then verify the original trigger and affected consumers. Follow [risk policy](../orchestrate-task/references/risk-policy.md); trivial documentation corrections do not need artificial test suites. Never invent a reproduction or test result when execution is unavailable.
5. Track repeated failures using the harness's issue-keyed attempts. After its three-failure limit, preserve observations and ask for the smallest blocking decision. Repeated failure is evidence to reassess assumptions, not proof that the architecture is wrong.
6. Use [verification-before-completion](../verification-before-completion/SKILL.md) before reporting resolution. Record root-cause, affected paths and regression risk in the selected route's artifact contract. This skill supplies investigation technique; [orchestrate-task](../orchestrate-task/SKILL.md) retains lifecycle ownership. A diagnostic request alone does not authorize code changes.

