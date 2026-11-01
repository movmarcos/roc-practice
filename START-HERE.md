# Apply ROC to your project

Use a copy of your own project. Keep the kit in a separate checkout so the assistant does not confuse examples with your project facts. In chat-only products, attach only the relevant project files.

## Bootstrap prompt

```text
Help me improve this project using a repeatable AI workflow. Infer the domain from actual project evidence; adapt to finance, investing, research, writing, software or other work.

1. Inspect the project and existing instructions. State observed facts, assumptions, constraints and the most important delivery friction.
2. Create the minimum useful structure for outcomes, context, decisions, current work and handoff. Reuse existing conventions; preserve existing files and resolve conflicts explicitly. Keep always-loaded instructions short.
3. Inventory capabilities/skills available in this session. Map the capabilities needed for my next task to actual implementations. Report partial or missing equivalents and their prerequisites. Never invent compatibility.
4. Select one bounded task that advances the stated outcome, define observable acceptance criteria, and deliver it using the tools actually available.
5. Review the artifact against those criteria; fix supported defects and retain actual check evidence.
6. Save a concise handoff with the current revision/state, decisions, evidence, remaining issues and next action.

Use the supplied ROC numbered prompts for detailed procedures if available. If they are not available, the six steps above are self-contained. Make reversible local changes within my requested scope. In a chat-only workspace, return named file contents and clearly state that you have not written files. Ask only for missing information that changes the outcome or authorization for consequential external actions.
```

For a controlled comparison, use the experiment protocol instead: this bootstrap prompt would contaminate the baseline.

## Continue

Use prompt 04 for another deliverable, 05 for review and 06 when resuming or changing tools. Add structure only when a real task shows its value.
