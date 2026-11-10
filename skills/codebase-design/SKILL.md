---
name: codebase-design
description: "Use when the architect or reviewer must choose a module interface, reuse boundary, dependency seam, or test surface for an authorized change."
---

# Module design — harness edition

Adapted from Matt Pocock's MIT-licensed codebase-design. See [notice](../../THIRD_PARTY_NOTICES.md).

1. Trace current callers and the behavior they need. Identify the smallest interface that hides meaningful complexity; record invariants, errors, ordering and dependencies alongside its signature.
2. Compare reusing the existing module with one focused alternative. Prefer the design that keeps a future change local and reduces knowledge spread across callers. An abstraction must earn its cost now; hypothetical variation alone does not justify an adapter.
3. Choose a test surface matching how callers use the interface. Keep external effects behind a real dependency seam when the task needs one. Preserve current repository terminology and conventions.
4. Record the chosen tradeoff, affected callers, compatibility risks and observable checks in the selected role's artifact. Stop when the authorized decision is settled; this technique does not authorize a wider refactor or source edits during review.

