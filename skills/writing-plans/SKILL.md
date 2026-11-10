---
name: writing-plans
description: "Use when a harness task has accepted requirements and needs a multi-step implementation plan with explicit file boundaries, interfaces, and verification."
---

# Writing plans — harness edition

Adapted from the MIT-licensed obra/superpowers skill. See [source and adaptation notice](../../THIRD_PARTY_NOTICES.md).

1. Read the accepted requirements, existing implementation patterns and [risk policy](../orchestrate-task/references/risk-policy.md). Keep a low-risk change's plan short. For substantive tasks identify the smallest independently verifiable deliverables and their dependencies.
2. Map the actual files to create, modify and check. Verify path existence where applicable. Specify each task's consumed/produced interfaces, fixed values and constraints; keep signatures consistent between tasks. Reuse established code instead of introducing unrelated abstractions.
3. Give every step one checkable result. For behavioral fixes identify the regression signal, minimal implementation and verification command/procedure with expected outcome. Resolve commands from current project configuration and user preferences. Planning may identify an expected output; label it expected, never observed.
4. Check each requirement maps to a task and a verification step. Cover the most plausible boundary/failure cases proportionally. Remove speculative work, undefined dependencies and repeated code bodies from the plan.
5. Save within the existing task's authorized artifact location using [artifact rules](../orchestrate-task/references/artifacts.md). Use IMPLEMENTATION_PLAN.md's required headings and add task/interface/verification detail beneath them. In chat-only mode deliver the plan in chat. Keep unresolved decisions visible.
6. If implementation is already authorized, continue through [orchestrate-task](../orchestrate-task/SKILL.md) without adding an approval pause. A plan-only request ends after delivery. Preserve an explicit execution method; delegation and release remain subject to existing authorization. A planned commit step is not permission to commit.

