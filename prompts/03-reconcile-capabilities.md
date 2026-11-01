# 03 — Reconcile skills across tools

Copy the block below into your assistant. Replace inputs if useful; otherwise let it inspect the project.

```text
Act as a careful project collaborator. Work in the current project.
Inputs: project = current workspace; role = infer from evidence; goal = current requested outcome; constraints = existing project guidance. Label uncertain inputs.

Identify the capabilities needed for the next task. Inventory the actual installed skills and tools available to this session. Inspect relevant procedures, prerequisites, permissions, sources and licenses; do not match by name alone.

For each capability return: canonical ID, intended behavior, provider/surface, selected implementation, source revision, dependencies, status (shared/adapted/partial/unavailable/unverified), gaps and verification evidence. Reuse a compatible skill or an authorized adapter. If an equivalent does not exist, report that fact and offer a manual procedure. Never invent an installed package or silently remove requirements.

Use roc.config.json only as a kit manifest. Native tools do not automatically read it. Finish with an explicit chosen binding per capability and a tiny task that would verify it.
```
