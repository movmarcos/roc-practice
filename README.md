# ROC Practice

**Make AI work repeatable. Inspect the evidence. Carry the project across tools.**

A public hands-on kit for people already using AI who want more reliable delivery, clearer context and better continuity. Apply the prompts to your own work: finance, investing, research, writing, software or another field. A website exercise makes the effects of structure visible.

This repository is independently usable. The [ROC training curriculum](https://movmarcos.github.io/Roc/) is maintained separately.

## Start

1. Open [START-HERE.md](START-HERE.md) and copy the bootstrap prompt into your assistant in an existing project.
2. Let the assistant inspect the project and create the minimum useful structure.
3. Use the [numbered prompts](prompts/) to deliver, review and resume real work.
4. Run the [four-condition website experiment](experiments/protocol.md) to compare outcomes.

The prompts work as ordinary text. Claude Code, GitHub Copilot and Codex can also use generated repository instructions and project skills. A prompt cannot grant access to files or tools your assistant does not have.

## Projects

- [AI Podcast Factory](projects/ai-podcast-factory/README.md): build a human-supervised system that turns verified technical material into short animated episodes.

## Optional tools

Python 3.10+; standard library only. Run commands from this kit checkout, with a separate target project:

```sh
python3 scripts/roc.py preview --target /absolute/path/to/your-project
python3 scripts/roc.py apply --target /absolute/path/to/your-project
python3 scripts/roc.py check --target /absolute/path/to/your-project
```

Preview first. The utility refuses collisions and locally edited generated files. It does not merge existing instructions: use prompt 02 to reconcile them. `roc.config.json` is the kit's own convention, not a native assistant configuration.

## Inspect AI activity

[ROC Lineage](extensions/roc-lineage/README.md) is an optional VS Code extension: graph, timeline, event details and file navigation. It reads local traces. A Claude Code hook collector is included; Codex and Copilot collectors are future integrations. The included trace is synthetic and labelled as a demonstration.

## What is portable?

Shared capabilities describe outcomes and procedures. Adapters expose them to each tool; [compatibility](docs/compatibility.md) records the limitations. A similarly named skill is not proof of equivalent behavior.

## Checks

```sh
python3 -m unittest discover -s tests -v
node --test extensions/roc-lineage/test/*.test.cjs
```

No comparative model results are claimed. Complete the experiment and save observed results in your own project. See [contributing](CONTRIBUTING.md) and the [MIT license](LICENSE).
