# Source map

| Supplied source | Adaptation |
| --- | --- |
| AGENTS.md | explicit routing precedence; separate navigation from execution |
| .agents/CONTEXT_POLICY.md | scoped role inputs and progressive loading |
| .agents/workflows/multiple-agent-workflow.md | feature roles, implementation plan, review/QA remediation, final release decision |
| .agents/workflows/hotfix-workflow.md | root cause, minimal diff, adversarial review and targeted QA |
| .agents/workflows/code-review.md | read-only review with source-grounded findings and walkthrough |
| .agents/agents/task-context-builder/agent.md | requirements, deterministic task naming and ambiguity handling |
| .agents/contracts/artifact-contracts.json | bundled filename, heading and verdict fallback contract; repository template paths removed |
| .agents/scripts/lib/handoff-state.ts | consumed artifacts and explicit receiving-role acknowledgement |
| .agents/runtime/README.md | advisory workflow versus host enforcement; revision-bound evidence |
| .agents/master-agent.md | separation of portable contracts and project facts; no bootstrap executor copied |

Intentional adaptations: no fixed source-project domains, no npm command assumptions, no mandatory initialization interview, no universal approval pauses for reversible authorized work, no automatic memory writes, and no claimed deterministic execution or independent agents. Existing adopted repository workflows retain their applicable gates and state tools.


Version 0.3.0 adds three adapted skills sourced from skills.sh/obra/superpowers. See THIRD_PARTY_NOTICES.md and its pinned source lock. The user-supplied Felix Rieseberg article is a linked resource with an original short summary; the outcome lens is optional and does not replace authorization or task scope.


Version 0.4.0: five delivery roles are structured in role-catalog.json; intake remains separate. Their packet selector is original plugin code. The additional module-design and test-first skills are adapted from the pinned sources recorded in third-party/role-skills/.


Version 0.5.0 adds original read-only project discovery and generic artifact contract 2.0.0. Historical contract 1.0.0 remains available for existing checkpoints. Source provenance is not a runtime dependency on the original repository.

