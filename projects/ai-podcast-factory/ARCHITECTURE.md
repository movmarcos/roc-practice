# AI Podcast Factory — proposed architecture

**Status:** Design only; components and interfaces below are not yet implemented.

## Flow and trust boundaries

```text
Topic + audience
    |
Allowlisted / approved source retrieval (read-only)
    |
Claim ledger + dated citations
    |
Executable code / examples --> sandbox tests
    |
Script + storyboard proposal --> HUMAN TECHNICAL APPROVAL
    |
Typed EpisodeSpec / shot manifest
    |
    +----------------------+-----------------------+
    |                      |                       |
Voice adapter       Character video          Authored technical
                     render adapter           hologram renderer
    |                      |                       |
    +----------------------+-----------------------+
                           |
                  Timeline composition
                   + synced captions
                           |
                    Automated checks
                           |
                   HUMAN RELEASE GATE
                           |
                         Export
```

An LLM is not the controller of authorisations. Treat any retrieved document, tool observation or model response as untrusted input. Explicit human approval is needed before running code with broad permissions, spending significant money, changing external resources or publishing.

## Proposed contracts

- `SourceRecord`: id, URL, title, retrieved time, trust classification and rights note.
- `ClaimRecord`: id, statement, supporting source IDs, checked time and verification status.
- `CodeExample`: language, dependencies, entrypoint, test command, observed and expected outputs.
- `EpisodeSpec`: id, topic, intended audience, characters, reference IDs, scenes, sources and approval state.
- `Scene`: shot ID, start/end, speaker, dialogue, camera, diagram spec and caption segments.
- `RenderRecord`: shot ID, input hash, model/adapter version, hardware, duration, cost, quality review and output path.

Implement these with explicit typed validation rather than relying on prose.

## Proposed workflow states

`DRAFT -> SOURCES_REVIEWED -> CODE_VERIFIED -> SCRIPT_APPROVED -> RENDERED -> QUALITY_APPROVED -> EXPORTED`

Use `NEEDS_REVISION` and `FAILED` with explicit retry budgets. An agent's self-reported approval cannot advance a privileged state. Persist decision IDs, payload hashes, retries and approval actors.

## Start with the smallest useful implementation

Python + typed schemas + pytest + SQLite checkpoints + FFmpeg + deterministic graphics + mocked model adapters. Then evaluate an agent framework, TTS/video model and GPU requirements on the same fixtures. A complex orchestration platform is unnecessary for a basic deterministic state machine.

## Security and cost

- Research role: allowlisted read-only retrieval; no privileged shell.
- Code verification: sandbox, time and resource limits, isolated outputs; no client secrets.
- Rendering: bounded cost, versioned reference IDs and stable prompts.
- Release: separate permissions and manual final approval.
- Rights: document voice, image, music and model licence obligations.

## Engineering comparisons

Compare deterministic script, one-agent and multi-agent variants with the same source pack, tests and metrics. Include accuracy, time, cost, human correction minutes, failure recovery, accepted shots per attempt, character stability and captions. No model should be declared "best" without an actual workload benchmark.
