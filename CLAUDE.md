# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

ROC Practice is a public, MIT-licensed kit that helps people who already use AI make their work repeatable: prompts, controlled experiments, a project-setup script, the ROC Lineage VS Code extension, and project guides. It must stay usable on its own, so do not link to or depend on the private ROC course repository.

## Commands

Python 3.10+ with the standard library only. Node is needed only for the extension tests.

```sh
python3 -m unittest discover -s tests -v            # all Python tests
python3 -m unittest discover -s tests -p test_roc.py -v  # one test file
node --test extensions/roc-lineage/test/*.test.cjs  # extension tests
python3 scripts/package_extension.py                # builds dist/roc-lineage-0.1.0.vsix
python3 scripts/roc.py preview --target /absolute/path/to/project
```

`roc.py` also has `apply` and `check`. Point `--target` at a separate project, never at this kit.

## How the pieces fit

- `prompts/` and `START-HERE.md` are plain text and work in any assistant. The bootstrap prompt must stay self-contained.
- `capabilities/*/SKILL.md` are the canonical skill procedures. `templates/project/` holds the canonical project files.
- `roc.config.json` maps each capability to each assistant, recording its status and verification. It is this kit's own convention, not a native assistant config.
- `scripts/roc.py` renders those sources into a target project as `CLAUDE.md`, `AGENTS.md`, or `.github/copilot-instructions.md`, plus skills. It refuses collisions and locally edited generated files. Change the canonical sources, not generated output.
- `scripts/claude_trace.py` is a Claude Code hook collector that writes metadata-only trace events, and `extensions/roc-lineage/` displays them. The event format is in `docs/lineage-events.md`.
- `experiments/` holds the four-condition website experiment, and `examples/website/` is its brief and content. Its run directories must sit outside this kit and any folder with AI instructions, or the instructions contaminate the baseline.
- `projects/ai-podcast-factory/` is a design and guide only. It has no agent or video code.

## Rules

- Claim only what was exercised. `docs/compatibility.md` separates documented support, fixture tests, and live verification, and adapter changes must name the exact product, surface, and version tested.
- Do not publish comparative model results without the evidence listed in `CONTRIBUTING.md`, and leave unmeasured values empty.
- The trace collector must keep omitting prompt bodies, commands, file contents, arguments, and tool results. Hooks never grant approval.
- Keep prompts useful across roles and technologies, with technology examples optional.
- Never publish private project files, transcripts, or credentials. `docs/superpowers/` is git-ignored internal planning.
