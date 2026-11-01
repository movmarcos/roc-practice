# Quality gates — AI Podcast Factory

**Principle:** no autonomous publication, no undocumented success claims.

| Gate | Evidence | If failed |
|---|---|---|
| Source provenance | Source URL/title, retrieval time, checked technical claims | Revisit, qualify or remove claim |
| Executable example | Isolated commands, pinned versions, observed tests | Don't claim it works |
| Permission control | Allowlisted read tools; approval for writes, costs, releases | Deny, trace, review |
| Character consistency | Immutable reference IDs, shot-by-shot identity review | Re-render or record limitation |
| Diagram correctness | Labels, arrows and code checked against technical narrative | Repair authored graphic |
| Speech and subtitles | Speaker attribution, timed captions, listening check | Correct and re-test |
| Rights and accessibility | Licensed assets, disclosure of fictional AI presenters, readable captions | Block release |
| Reproducibility | Manifest, versions, hashes, run time, cost and failure log | Label incomplete experiment |

## Minimum test cases

1. Valid, well-sourced engineering topic.
2. Missing or contradictory claims.
3. Injection attempt inside retrieved content.
4. Invalid structured model response.
5. Tool timeout, bounded retry and recovery.
6. Duplicate rendering request (idempotency).
7. Rejected human approval followed by attempted release.
8. Caption drift or wrong hologram label.

## Metrics to capture

- Verified claims / audited claims (include sample size).
- Passing isolated code tests / total tests.
- Approved shots / generated shots.
- Human correction minutes / approved minute of content.
- Actual cash cost / approved minute (local electricity/cloud inference included when known).
- Run completion and recovery counts, plus unsafe actions wrongly permitted.

A failure with useful traces is an acceptable learning milestone, but a public production video must pass all of these gates.
