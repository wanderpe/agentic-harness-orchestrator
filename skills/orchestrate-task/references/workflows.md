# Routes

Select the proportional tier from [risk and evidence policy](risk-policy.md) before applying the standard routes below. Explicit user workflow selection wins. Adopt an existing repository lifecycle only when it governs the target task; do not copy state names into an unrelated repository.

| Intent | Sequential roles | Required fallback evidence |
| --- | --- | --- |
| Feature / substantive change | Context builder → architect when needed → implementer → reviewer → QA | TASK_CONTEXT.md, IMPLEMENTATION_PLAN.md, CODE_REVIEW.md, QA_REPORT.md; ARCHITECTURE_PLAN.md for cross-module decisions |
| Urgent bug / regression | Root-cause analysis → implementer → adversarial diff review → targeted QA | HOTFIX_CONTEXT.md, HOTFIX_PLAN.md, CODE_REVIEW.md, QA_REPORT.md |
| Frontend task | Context → implementer → frontend review → QA | task context, plan, review, QA; assess responsive layout, accessibility, i18n, state, loading and error paths |
| Review only | Reviewer | CODE_REVIEW.md; source remains unchanged |
| Resume / status | Reconciler → next valid role | checkpoint plus verified evidence |

The fallback feature route requires no repeated approval for reversible work already authorized. Ask for decisions where requirements are consequential and unresolved. Honor explicit gates in an adopted repository workflow. Before external release, bind authorization to scope, content revision, operation and target.

Hotfix analysis must distinguish symptom and root cause, trace callers, and capture a reproduction or honest inability to reproduce. Apply the narrowest correction at the responsible layer. QA covers the reported regression and affected consumers. Features reuse existing modules and test against observable acceptance criteria.


