# Agent Handoff for Codex

Codex plugin package for the `handoff` CLI. It bundles an Agent Handoff skill for syncing the Codex profile (`~/.codex`) across machines.

## Requirements

- `handoff` CLI on `PATH`
- An initialized hub via `handoff init --profile codex ...`

## Install

Codex v0.130 uses `/plugins` in the TUI. There is no `/plugin marketplace add ...` slash command.

From a terminal:

```bash
codex plugin marketplace add /path/to/agent-handoff
codex
```

Inside Codex, open `/plugins`, install/enable **Agent Handoff**, then restart Codex so the bundled skill is loaded.

Codex v0.130 plugins expose skills, apps, MCP servers, and hooks. This plugin does not create TUI slash commands, so `/push` or `/agent-handoff:push` will not appear in the `/` command palette.

## CLI Commands

| Task | CLI flow |
|---|---|
| Initialize | `handoff init --profile codex ...` |
| Push | `handoff push --dry-run`, then `handoff push` with an explicit secret policy if needed |
| Pull | source selection, dry-run preview, confirmation, then `handoff pull --from <device>` |
| Diff | `handoff diff` |
| Status | `handoff status` |
| Doctor | `handoff doctor` |
| Bootstrap | `handoff bootstrap --dry-run`, then `handoff bootstrap --yes` after confirmation |
| Dependencies | `handoff deps ...` |
