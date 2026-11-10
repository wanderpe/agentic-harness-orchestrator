# Artifact contracts

[Current contracts](artifact-contracts.json) define generic filenames, required headings and PASS/FAIL fields. Adopted repository contracts take precedence. Populate headings with observations or a concrete applicability limit; empty headings are not evidence.

New fallback checkpoints declare artifactContractVersion 2.0.0. Existing checkpoints without that field use [legacy contracts](artifact-contracts.legacy.json), version 1.0.0. Preserve their artifacts and hashes; migrate only explicitly, retaining prior state and revalidating evidence. The optional guard accepts both and rejects unknown versions. Its catalog is a fallback; adopted custom repository contracts use their own validator or a labeled manual check.

Add measurable acceptance criteria to task context and content identity/evidence to review and QA. Unavailable execution leaves the verdict unset with NOT_RUN evidence, never PASS. Project Notes Updated can say not requested/not applicable; it grants no memory-write authorization. Release Result records only observed operations and their identifiers.

For scripted gates, artifact records carry type, workspace-relative path, byte SHA-256 and contentIdentity. Receiving receipts bind the current artifact path/hash and source identity to producer, receiver, times and acknowledgement. See [evidence gate](evidence-gate.md). Schema validation cannot authenticate these assertions or establish semantic correctness.

