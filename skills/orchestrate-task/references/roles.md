# Five delivery roles

Intake extracts requirements and acceptance criteria before delivery; it is not a sixth delivery agent. The five roles are architect, implementer, reviewer, QA validator and release manager.

Read only the selected object in [role catalog](role-catalog.json). It owns that role's entry condition, inputs, actions, completion test, return path and conditional skills. [Artifact contracts](artifact-contracts.json) own filenames/headings; adopted repository contracts take precedence. Supply current task paths and content identity with every packet. Read linked skills only when their condition applies.

When scripts are available, obtain one packet with:

    node <plugin-skill>/scripts/role-packet.cjs <architect|implementer|reviewer|qa|release> [facts.json]

Facts are booleans: interfaceDesign, multiStep, bug, tdd, independentRequired, independentAvailable. Default false means no optional technique. A packet reports advisory permissions and selected skill paths; it launches nothing. ready concerns packet construction/declared reviewer availability, not proof of entry evidence or authorization. Check entry facts against actual evidence before work. Chat-only hosts read the selected catalog object manually.

Use sequential roles unless real delegation is authorized and supported. Identify sequential self-review honestly. Each receiver consumes current artifacts before acknowledging them under [checkpoint protocol](checkpoints.md); changed source invalidates downstream evidence.

