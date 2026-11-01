# Version 1 lineage events

One JSON object per line (JSONL). Required fields:

| Field | Meaning |
| --- | --- |
| `version` | Integer `1` |
| `id` | Event ID, unique within source/session; repeat to update status |
| `sessionId`, `source` | Session and collector identity |
| `timestamp` | Parseable timestamp; collectors emit ISO 8601 UTC |
| `kind` | `session`, `task`, `context`, `skill`, `tool`, `artifact`, `check`, `message` |
| `label` | Short description, at most 500 characters |
| `status` | `started`, `completed`, `failed`, `info` |
| `evidence` | `recorded`, `reported`, `inferred` |

Optional `parentId` links an explicitly recorded event relationship within the same source/session. `path` is a project-relative file path. The viewer does not execute trace content. Unknown fields are discarded. Invalid or incomplete lines produce warnings; the next refresh can parse a completed append.

Recorded means emitted from an observed runtime event, not independently cryptographically authenticated. Reported means supplied as an assistant or human claim. Inferred means reconstructed grouping or interpretation. Imported labels remain untrusted claims about their source. Do not fabricate an instruction-loaded event because an instruction file exists.

The viewer groups disconnected events by session with inferred edges. It does not invent prompt-to-file causal relationships. Explicit parent edges preserve the event's evidence class. Tool updates share IDs; independent calls must use different IDs. Rotate traces before exceeding 10 MiB or 10,000 records. The graph displays a bounded slice; timeline/session filtering supports larger logs.

The Claude collector observes selected hooks. Successful Read/Edit/Write events can attach project-relative files to tool calls. Skill tool invocations can attach a skill name. It does not infer tests from command names or capture command text. Prompt submissions omit the prompt body. Tool call completion does not assert that the full user task succeeded.
