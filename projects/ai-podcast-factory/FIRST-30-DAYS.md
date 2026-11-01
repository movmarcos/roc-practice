# First 30 days — practical sprint

**Goal:** build and verify a small agentic engineering workflow. The first deliverable is a reproducible outline-generation system, **not** a full AI video.

## Week 1 — Establish the baseline

1. Run [prompt 01](../../prompts/01-assess-project.md) in your project to assess what your assistant can actually see.
2. Identify what the assistant sees from prompt, repository, tools, external sources and durable files. Do not confuse context with memory.
3. Choose one short technical question such as "How does Snowflake separate storage and compute?" and prepare a *manually verified* five-beat outline.
4. Record baseline duration, source accuracy, model version, intervention and failure cases.

**Exit evidence:** a reproducible context map, sample inputs/outputs and baseline measurement.

## Week 2 — Build the contract

1. Run [prompt 02](../../prompts/02-structure-project.md) to create short, useful project guidance.
2. Define a structured EpisodeOutline schema: topic, audience, claim IDs, sources, five beats, characters, expected artefacts and review state.
3. Create four fixtures: valid data, missing attribution, contradictory sources, and malicious instructions in an external source.
4. Repeat the baseline with improved repository guidance, and compare results on the same fixtures.

**Exit evidence:** schema, fixtures, tested guidance and an explanation of any improvement or regression.

## Week 3 — Write deterministic code first

1. Build a Python CLI that accepts approved sources and a topic, then validates a structured outline.
2. Use JSON Schema or Pydantic and fail closed for missing sources or unsupported claims.
3. Introduce pytest fixtures and test failure modes offline with a mocked model adapter.
4. Record setup, commands, versions and observed outputs; no claimed results without actual runs.

**Exit evidence:** an executable script with passing success and failure-path tests.

## Week 4 — Compare with one tool-using agent

1. Allow one agent to call an allowlisted *read-only* research interface. No publish or privileged file access.
2. Capture tool observations, source IDs, validation failures, cost, time and retries.
3. Compare deterministic and agent-assisted workflows on identical held-out cases.
4. Write one Architecture Decision Record: when did a reasoning agent add value? What was unnecessary?

**Exit evidence:** one traced successful run, one failure/denial trace, four-fixture results, and a short reflective design note.

## Deliverables

- A dated copy of the [learning log](LEARNING-LOG.md).
- Runnable minimal code, lockfile/dependency versions and pytest tests in your own project repository.
- Test fixtures and a comparison table.
- One-page ADR, including permissions and reasons for choosing an agent.
- Next-month backlog for persisted state and approval.

**Do not:** buy a GPU, publish unverified Snowflake claims, commit secrets, promise natural avatar lip-sync, or automate YouTube publishing in this sprint.
