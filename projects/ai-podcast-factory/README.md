# AI Podcast Factory — hands-on project

Build a human-supervised system that turns verified technical material and tested example code into short animated episodes. The project teaches agentic engineering, so reliable evidence matters more than a polished video.

**Status:** Starter guide. This kit contains no agent, voice or video code; you build that in your own project.

The plan and design are in this folder:

- [Project brief](BRIEF.md)
- [Architecture and contracts](ARCHITECTURE.md)
- [Quality gates](QUALITY-GATES.md)
- [Pilot episode brief](EPISODE-001.md)
- [12-month plan](12-MONTH-PLAN.md)

## Set up

Create a separate repository for your project and keep this kit in its own checkout. One possible layout:

```text
your-podcast-factory/
  sources/     approved sources and claim records
  fixtures/    valid, missing-attribution, contradictory and malicious inputs
  src/         the command-line tool and schemas
  tests/       pytest success and failure cases
  decisions/   architecture decision records
  logs/        one dated learning log per experiment
```

Then run the [bootstrap prompt](../../START-HERE.md) in that repository, and copy the [learning log template](LEARNING-LOG.md) into `logs/`.

## First 30 days

Follow the [full sprint](FIRST-30-DAYS.md). You are done with each week when you have this evidence:

| Week | Build | Exit evidence |
|---|---|---|
| 1 | A manually verified five-beat outline for one technical question | Context map, sample inputs and outputs, baseline measurement |
| 2 | An `EpisodeOutline` schema and four fixtures | Schema, fixtures, tested guidance, explanation of any change in results |
| 3 | A Python command-line tool that validates outlines and fails closed | Passing success and failure tests |
| 4 | One agent with a read-only, allowlisted research tool | One successful trace, one failure or denial trace, four-fixture results, design note |

Do not buy a GPU, publish unverified claims, commit secrets or automate publishing during this sprint.
