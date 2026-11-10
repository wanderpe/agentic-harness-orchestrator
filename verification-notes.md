# Verification

Version 0.2.0 includes executable tests for the read-only evidence guard: valid review/QA/release records; stale source, verdicts, artifacts and approval; failed/unrun checks; wrong operation, target or scope; missing handoff receipts; unverified acceptance criteria; read-only scope boundaries; unknown schema; invalid paths; high-risk architecture requirements; stable content identity; and read-only behavior.

Run scripts/guard.test.cjs under the orchestrate-task skill with node --test. Package validation checks both manifests, preserved prompts/presentation/skills, JSON/YAML, contained Markdown references, icon paths and archive membership. Results of the current build are recorded in the update delivery; tests here remain reproducible.

Behavioral model cases are documented in references/evaluation-scenarios.md. They have not been executed as fresh model sessions. No real repository fix, release, remote integration, independent-agent execution, concurrent state control or security enforcement is proven by these unit tests.


Version 0.3.0 package validation additionally checks seven discoverable skills, preserved existing components, all local links, pinned upstream source hashes, retained MIT license and installed adaptation paths. The 33 existing guard regression tests remain applicable. New skill wording is structurally reviewed; no fresh model behavioral evaluation is claimed.


Version 0.4.0 adds executable role-packet tests for conditional selection, unknown/nonboolean facts, review-only permissions, independent-review availability, release boundaries and immutable packets. They test deterministic packet behavior, not agent quality. Existing guard tests remain unchanged. Package checks verify nine discoverable skills, five catalog roles, installed skill/contract references, source hashes and a shorter main orchestrator. No fresh model evaluation is claimed.


Version 0.5.0 tests discovery against disposable JavaScript/Bun/npm/pnpm monorepo, Python/uv, mixed Node/Python, PHP, Rust, Go, .NET, Java and unknown-toolchain fixtures; no project builds were run. Legacy/current artifact versions are tested separately. These tests establish discovery/validator behavior, not universal compatibility or model quality. Public listing readiness remains separate from archive validation and requires published pages, publisher verification, required scans/attestations and approval.

