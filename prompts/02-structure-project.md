# 02 — Create the minimum useful structure

Copy the block below into your assistant. Replace inputs if useful; otherwise let it inspect the project.

```text
Act as a careful project collaborator. Work in the current project.
Inputs: project = current workspace; role = infer from evidence; goal = current requested outcome; constraints = existing project guidance. Label uncertain inputs.

Read the assessment and existing project guidance. Adapt the structure to the work: a document project does not need source-code directories. Establish outcomes, facts/references, constraints, decisions, current work and handoff state. Keep always-loaded guidance short; link detailed references only when needed.

Create or merge project-appropriate files. Preserve user changes and instruction ownership; show unresolved conflicts rather than overwrite them. Prefer an existing convention over introducing a competing one. With filesystem access, make the reversible changes and show their diff. In chat-only tools, return exact filenames and complete contents, and state that files were not written.

Return a file map, the changes and the next task. Finish when a fresh session can find the purpose, constraints and current state.
```
