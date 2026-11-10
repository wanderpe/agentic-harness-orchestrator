# Third-party skill notices

This plugin bundles adapted editions of three MIT-licensed obra/superpowers skills discovered on skills.sh. Copyright (c) 2025 Jesse Vincent. The full notice and license are preserved in [LICENSE](third-party/superpowers/LICENSE). These are adapted imports, not unmodified installations or an endorsement by their author.

Source commit: 2ce8aa15d05bd57213e6f746f953aafb7ded7a8b. Exact source URLs and source-byte SHA-256 hashes are recorded in [source lock](third-party/superpowers/source-lock.json). Original instruction text is retained as passive .upstream.txt material for provenance, not loaded as active instructions.

| Installed skill | Directory listing | Adaptation |
| --- | --- | --- |
| systematic-debugging | [skills.sh](https://skills.sh/obra/superpowers/systematic-debugging) | Preserve causal investigation and hypothesis testing; use harness retry policy and honest unavailable-reproduction outcomes. No automatic diagnostic shell execution or required external skills. |
| writing-plans | [skills.sh](https://skills.sh/obra/superpowers/writing-plans) | Preserve file/interface/task decomposition; use existing artifact location, risk tiers and authorization. Remove automatic commits, mandatory worktrees and forced plan-approval pauses. |
| verification-before-completion | [skills.sh](https://skills.sh/obra/superpowers/verification-before-completion) | Preserve evidence-backed claims; bind evidence to current content rather than requiring repeated runs on every message. Use NOT_RUN when tools are unavailable. |

All three use the harness's adopted-repository contracts and available host tools. They cannot expand authorization, spawn workers without permission, install further software, send messages, or release changes merely because an upstream example describes doing so. No external services, hooks, executables, dependencies or background processes were installed with these skills. The selected upstream package texts were reviewed; directory popularity is not a security guarantee.


## Version 0.4.0 role techniques

Two additional adapted imports are bundled: Matt Pocock's codebase-design (Copyright (c) 2026 Matt Pocock) and obra/superpowers test-driven-development (Copyright (c) 2025 Jesse Vincent). Full MIT notices, pinned source hashes and passive original texts are stored under third-party/role-skills/codebase-design/ and third-party/role-skills/test-driven-development/.

The architecture adaptation keeps module/interface/test-surface decisions without imposing a new vocabulary or parallel workers. The TDD adaptation keeps observed red/green regression proof while preserving existing code, proportional tests, role permissions and authorized scope. It removes upstream blanket test mandates and instructions to delete existing implementation. Neither adds dependencies or scripts.

