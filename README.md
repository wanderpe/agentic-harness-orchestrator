# Agentic Harness Orchestrator

A skills-based workflow harness for software work in existing codebases. Five delivery roles handle architecture, implementation, review, QA and release; intake establishes scope and acceptance criteria. Nine portable skills are loaded on demand.

Use it for features, defects, refactors, reviews and checkpoint recovery. Start with a repository or relevant source files and a concrete desired outcome. The harness inspects that project's instructions, manifests, conventions and checks rather than choosing a fixed framework or package manager.

Examples:

- Plan a scoped change using this project's existing tooling.
- Investigate this regression and stop before release.
- Review this diff without modifying source.
- Resume this checkpoint and recheck stale evidence.

Read [project adaptation](skills/orchestrate-task/references/project-adaptation.md) for discovery and custom-toolchain fallback. Optional Node.js helpers profile manifests, construct bounded role packets and validate evidence records. They execute no project commands and create no background service. In hosts without script execution, use the documented manual checks. The host must separately provide authorized repository access, editing and checks; the plugin does not grant them.

The workflow is stack-neutral. The built-in discovery helper recognizes common markers, not every build system; unknown projects use documented manual inspection. Public availability does not imply universal runtime compatibility or proven agent performance on every project. See [verification notes](verification-notes.md).

Third-party adapted skills, original sources and MIT notices are recorded in [third-party notices](THIRD_PARTY_NOTICES.md). The optional [outcome resource](skills/orchestrate-task/references/ambition-resource.md) is linked with attribution. No project source, task history or credentials are included in the package.

