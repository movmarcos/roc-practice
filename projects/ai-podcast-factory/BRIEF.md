# AI Podcast Factory — project brief

**Status:** Design proposal / experiment; not implemented production software.

## Product hypothesis

A reliable, human-supervised system can transform carefully verified engineering knowledge into engaging and accurate animated podcast episodes. Learning and engineering evidence take precedence over monetisation.

## Identity and scope

- Audience: experienced data, software and AI engineers.
- Topics: agentic frameworks, MCP/tool interfaces, orchestration, evals, SQL, data architecture, cloud, security, reliability and code.
- Creative set: one permanent futuristic circular lounge; two curved sofas; a central technical hologram.
- Recurring presenters: Alex (younger male host in blue hoodie), Maya (critical host), Sam (data architect), Priya (short-haired female AI systems architect with glasses).
- First experiment: 30–60 seconds with **Alex + Priya** discussing Snowflake's separation of storage, compute and cloud services.
- Output: 16:9, English, accurate subtitles, separate technically accurate diagram layer.

## Editorial idea

**Build it. Break it. Explain why.** A presenter asks a practical engineering question; the expert makes architecture visible through the hologram, demonstrates working code where appropriate, and explores real failure modes and alternatives.

## End-to-end workflow

1. Select technical question and audience.
2. Collect approved sources with retrieval dates and licences.
3. Build claim ledger and execute any illustrative code in a sandbox.
4. Generate an episode outline, dialogue and structured shot manifest.
5. Obtain **human technical/script approval**.
6. Render voice and short character shots using immutable references to each person and the studio.
7. Compose authored technical holograms, graphics and timed captions separately from generative video.
8. Evaluate factual quality, identity continuity, speech, motion, captions, rights, costs and accessibility.
9. Obtain **human release approval** before export/publishing. No automatic upload.

## Success criterion

A single short reproducible, reviewed clip with accurate claims and diagrams, stable references, cost/manifests, source attribution, and an engineering explanation of failures and limitations.

## Documentation

- [Architecture and contracts](ARCHITECTURE.md)
- [Quality and release gates](QUALITY-GATES.md)
- [Pilot episode brief](EPISODE-001.md)
- [12-month plan](12-MONTH-PLAN.md)
- [First 30 days](FIRST-30-DAYS.md)

Don't treat a generated still image as proof of human-like movement. Larger models and multi-agent components must earn their place through benchmarks. Keep large videos in an artefact store, not in Git, and only include rights-cleared assets.
