# Four-run website experiment

Treat this as a demonstration until repeated evidence supports a stronger conclusion. Structure may help, cost more than it saves, or introduce conflicting instructions.

## Prepare once

Choose one tool, model/version, execution surface, settings, tool permissions and time budget (suggestion: 20 minutes per initial build, 10 minutes for each follow-up). Keep them constant. Record exceptions. Give all runs the same brief, content.json and acceptance criteria. Retain this factual packet byte-for-byte.

Create four independent empty repositories/directories outside this kit and outside any ancestor with AI instructions. Use fresh sessions and separate AI workspaces. Inventory global instructions, memory, plugins and personal skills; record contamination that cannot be disabled. Do not change personal settings automatically. Randomize run order where possible.

## Conditions

| Run | Workspace workflow guidance | Repository workflow guidance |
| --- | --- | --- |
| A | Absent | Absent |
| B | Present | Absent |
| C | Absent | Present |
| D | Present | Present |

For B/D install `templates/workspace/instructions.md` in the product's persistent project/workspace instructions. For C/D use the kit utility to install the chosen target's instructions/capabilities, then populate `.roc/context.md` from the common packet. Put workflow guidance only in the designated layer. Do not run the bootstrap or structure prompts in A/B: that would change the condition.

Some repo agents lack a native persistent workspace feature. Use an explicitly recorded session packet proxy or mark B/D unsupported. Do not compare a web-chat build with an editor-agent build and attribute the difference solely to structure. D should reference consistent factual sources, not duplicate contradictory copies. Record extra context size: instruction volume is also changed by this experiment.

## Execute each run

1. Save a run record and start revision. Supply the common packet and prompt: “Build the website described in the attached brief and content. Deliver the files, run instructions and evidence of checks performed.”
2. Stop at the shared time limit. Save artifacts, diff, checks, interventions and actual available usage data. Capture screenshots at the two required widths.
3. Issue the brief's follow-up change with the same allowance; capture the result.
4. Start a fresh session in the same condition and issue the recovery task. Preserve the same context policy.
5. Score the artifact using `scorecard.md`, preferably with condition labels hidden from the evaluator.

Keep result artifacts in your own workspace, not inside the kit checkout. Never fill gaps with estimated tool events or fabricated checks. Optional lineage instrumentation should be identical in all runs and record observations without injecting guidance. If the instrumentation adds context or changes permissions, record it as a confound.

## Interpret

Compare the output and the process: adherence, regressions, recovery, interventions, elapsed time and measured usage. One attractive screenshot is not sufficient evidence of working behavior. Tool switching is a separate exploratory round because it changes more than context structure.
