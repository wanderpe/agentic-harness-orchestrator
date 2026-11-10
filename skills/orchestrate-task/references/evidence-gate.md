# Optional read-only evidence gate

This plugin bundles scripts/guard.cjs and scripts/guard.test.cjs under the orchestrate-task skill. They require Node.js built-ins only and can also run with Bun. They are packaged helpers, not registered MCP tools, a state manager, or a host permission system. Execute them only when the host exposes authorized script execution. In chat-only mode use the same checks manually and say that the result is advisory, not script-validated.

Use the checkpoint-v2.example.json beside this document as a field map; replace every placeholder using observed task facts. Never treat example approval as user authorization. Version-1 checkpoints remain readable context: migrate only observed values, leave unknowns unset, and rerun validation. Preserve the prior checkpoint until the replacement is reviewed.

Invoke the real script path, workspace root and task checkpoint with arguments safely quoted for the shell:

    node <plugin-skill>/scripts/guard.cjs fingerprint <workspace> <checkpoint.json>
    node <plugin-skill>/scripts/guard.cjs check <workspace> <checkpoint.json> review
    node <plugin-skill>/scripts/guard.cjs check <workspace> <checkpoint.json> qa
    node <plugin-skill>/scripts/guard.cjs check <workspace> <checkpoint.json> release

The helper reads only. fingerprint returns a SHA-256 of sorted file paths and their current byte hashes, including declared untracked files. check recomputes that identity, validates required artifact bytes/headings, receiving acknowledgements and relevant verdicts, and returns ok plus errors. Exit code 1 means the gate did not pass. It never repairs state, executes project commands, calls agents, edits files, commits, pushes or deploys. Adopted repository state managers remain authoritative; this helper does not replace or bypass them.

Review gate requires the route's context/plan and receiving receipts. QA gate additionally requires current passing code review and its artifact/receipt. Release gate additionally requires passing QA, required checks, all acceptance results and exact matching release approval scope/identity/operation/target. Read-only review routes cannot advance to release; implementation-only tasks cannot release. Actual source changes invalidate downstream results by identity mismatch even if the checkpoint says PASS.

Limits: supplied records are assertions. The helper cannot authenticate conversation approval, reviewer identity, command output or independence. Verify these against actual host/conversation evidence. It cannot prove the declared file scope is complete: compare the entire working diff and staged diff, relevant untracked files, dependencies and configuration before release. It rejects symlinks, directories, missing files and deletion scopes. For deletions use an adopted repository validator or manual diff/patch identity checks, explicitly labeling the fallback. It does not lock files or prevent edits after checking: recheck immediately before a dependent operation and reconcile concurrent changes. Do not claim atomic release or technically enforced permissions.

To verify the bundled validator itself:

    node --test <plugin-skill>/scripts/guard.test.cjs

These tests validate the helper's decisions, not model behavior. Use evaluation-scenarios.md to evaluate the assistant's workflow separately.


Project discovery is optional and read-only; see [project adaptation](project-adaptation.md). New checkpoint artifacts use contract 2.0.0; absent version fields retain legacy 1.0.0 headings. Custom adopted repository contracts remain outside this fallback helper.

