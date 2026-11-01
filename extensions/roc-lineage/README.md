# ROC Lineage — VS Code extension

Inspect a local AI trace as a graph and timeline. Select a node for evidence, status and a project-file link. Recorded, reported and inferred relationships remain distinct. Graphs show up to 250 nodes at once; session filters and the timeline expose the rest. Trace limit: 10 MiB / 10,000 valid event records.

## Try it

1. Open this folder in VS Code.
2. Use Run → Start Debugging (F5) with the included launch configuration.
3. In the Extension Development Host, run **ROC: Show Lineage Demo** from the Command Palette.

The sample is synthetic. It demonstrates the UI, not observed assistant behavior.

To install locally, run `python3 scripts/package_extension.py` from the repository root, then use **Extensions: Install from VSIX…** and select `dist/roc-lineage-0.1.0.vsix`. Packaging uses only Python's standard library. This release is not published to the Visual Studio Marketplace; `roc-project` is the package namespace, not a claim of a registered publisher.

## Capture Claude Code activity

The collector is opt-in and fixture-tested. Live Claude Code verification remains pending. Review and merge [the example hooks](https://github.com/movmarcos/roc-practice/blob/main/adapters/claude/hooks.example.json) into the target project's `.claude/settings.json`. Replace the absolute paths: the collector location, trace destination and stable target project root. Preserve existing hooks. Do not run the example unchanged.

Add `.roc/trace.jsonl` to the target project's `.gitignore`. Keep `.roc/context.md` and `.roc/state.md` versioned when appropriate; do not ignore the whole directory. Start a fresh Claude Code session, perform a harmless file read, then run **ROC: Open Lineage Trace** and choose the trace. The viewer watches the selected file for updates.

The collector stores event metadata and project-relative file paths. It omits prompt bodies, commands, file contents, arguments and tool results. Filenames and skill names can still reveal project details. There is no network upload or telemetry. Hooks return no permission decision and never grant approval. Capture errors are reported to stderr but do not intentionally stop the agent. A missing event is not proof of an action's absence.

Automatic file navigation is limited to an existing file within the first trusted local workspace folder, with real-path checks. Open the corresponding project as a single-folder workspace when inspecting its trace. It is disabled for the bundled demo and untrusted workspaces.

## Coverage

| Source | This release |
| --- | --- |
| Claude Code hooks | Metadata collector implemented; fixture-tested |
| Copilot hooks | Planned adapter; not implemented |
| Codex App Server | Planned adapter; not implemented |
| Version 1 JSONL | Viewer imports normalized events from any source |

The extension does not intercept arbitrary activity in other extensions. It cannot show a complete internal model reasoning process. File reads and instruction loads are observations, not proof they caused a later choice. Agent-authored explanations remain reported claims.

See [event format](https://github.com/movmarcos/roc-practice/blob/main/docs/lineage-events.md) and [compatibility](https://github.com/movmarcos/roc-practice/blob/main/docs/compatibility.md).
