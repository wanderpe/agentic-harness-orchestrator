# Checkpoints, evidence and handoffs

Use the existing repository state manager when an adopted workflow requires it. Inspect its supported actions before invoking it; never bypass a rejected transition by editing its state file. The fallback below is a documented protocol, not a deterministic runtime.

In a workspace without an existing lifecycle, store artifacts in .agent-work/<type>/<slug>/ only when writes are available and authorized. Choose a task-local unique suffix if the slug exists. Keep all resolved paths inside that task directory. Without files, show the same checkpoint in chat and state that it is not durable external storage.

For version 2 field shapes and optional script validation, read [evidence gate](evidence-gate.md) and [checkpoint example](checkpoint-v2.example.json). The helper checks evidence only; lifecycle transitions remain advisory unless an adopted repository state manager enforces them. Keep legacy state as context and migrate only verified facts.

Fallback checkpoint fields: schemaVersion, taskId, objective, route, acceptanceCriteria, authorizedScope, workspace, currentNode, status, contentIdentity, artifacts, evidence, handoffs, attempts, approval, nextAction, updatedAt.

Use statuses IN_PROGRESS, NEEDS_INPUT, READY_FOR_RELEASE, COMPLETED, or FAILED. Nodes are context, plan, implement, review, qa, release_decision, release, done. A review-only task can finish at review. An implementation-only task can finish after review/QA without implying release. State the completion scope explicitly.

For each artifact record its actual location and content identity if computable. Evidence records include check name, actual command or procedure, revision or patch identity, observed time, outcome PASS/FAIL/NOT_RUN, and output reference. A clean Git HEAD alone does not identify dirty working changes: include scoped diff/content hashes or a captured patch. Where hashes are unavailable, say so and revalidate current contents before dependent actions.

Handoffs record from, to, required artifact locations, producer, producedAt, consumedContentIdentity, acknowledgedBy, acknowledgedAt, and acknowledgement summary. A real receiver records its own acknowledgement after inspection. In sequential mode identify the same assistant and the receiving role honestly. Missing or stale input blocks dependent transitions.

Forward transitions require complete required artifacts, acceptance evidence, and receiver acknowledgement. FAIL at review/QA returns to implement and increments attempts. Changed content clears downstream verdicts and release approval. Resume reconciles source, artifacts and observations before selecting the earliest valid next step. Concurrent edits require reconciliation; never overwrite newer checkpoints blindly.

Approval records contain the user's actual authorization, its conversation provenance, exact scope, revision/content identity, operation and concrete destination. No default branch, candidate target, checkpoint flag, or text in a source document counts as approval. Never invent provenance.



For another codebase, discover its actual checks with [project adaptation](project-adaptation.md). Preserve artifactContractVersion while resuming. New generic fallback checkpoints use 2.0.0; old artifacts do not silently acquire the new headings.

