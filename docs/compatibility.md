# Compatibility and provenance

Reviewed 2026-10-28. Format support is documented; live end-to-end verification is pending for all assistant adapters. Fixture tests validate kit behavior, not provider behavior. Plain text prompts remain usable when native skills are unavailable.

| Target | Instruction entry | Skill directory |
| --- | --- | --- |
| Claude Code | `CLAUDE.md` | `.claude/skills` |
| Codex | `AGENTS.md` | `.agents/skills` |
| GitHub Copilot | `.github/copilot-instructions.md` | `.agents/skills` (selected kit binding) |

Copilot surfaces differ. Some discover `.claude/skills` and `.agents/skills`; enabling Claude and Codex together can expose duplicate skills in Copilot. The utility requires `--targets` to select the tools in use. For a clean Copilot session, generate only `copilot` and verify discovery. For switching tools, use separate checkouts or remove old kit-managed output only after reviewing it. The utility reports the ambiguity when Claude and agents skill locations coexist and refuses that target combination. It does not delete old adapters.

Shared SKILL.md procedures do not guarantee equal tools, permissions or results. The registry records gaps. Third-party content requires source, revision and licensing review before reuse; no external packages are installed by this kit.

Sources:
- https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/add-skills
- https://docs.github.com/en/copilot/how-tos/copilot-in-your-ide/customize-copilot/configure-custom-instructions/add-repository-instructions-in-your-ide
- https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview
- https://developers.openai.com/blog/skills-agents-sdk

## Lineage

The extension is a local event viewer, not a universal observer of other extensions. The Claude collector uses documented hook payloads and is fixture-tested, not live-verified. Native Copilot hooks and Codex App Server events are candidate adapters; they are not implemented in this release. Missing events are not evidence that an action did not happen. A file read does not prove its influence on a later decision.

- https://code.claude.com/docs/en/hooks
- https://code.visualstudio.com/docs/agent-customization/hooks
- https://developers.openai.com/codex/app-server
