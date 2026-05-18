# Agent Handoff for Codex

Codex plugin wrapper for the `handoff` CLI. It exposes slash commands for syncing the Codex profile (`~/.codex`) across machines.

## Requirements

- `handoff` CLI on `PATH`
- An initialized hub via `/init` or `handoff init --profile codex ...`

## Commands

| Command | CLI flow |
|---|---|
| `/init` | `handoff init --profile codex ...` |
| `/push` | `handoff push --dry-run`, then `handoff push` with an explicit secret policy if needed |
| `/pull` | source selection, dry-run preview, confirmation, then `handoff pull --from <device>` |
| `/diff` | `handoff diff` |
| `/status` | `handoff status` |
| `/doctor` | `handoff doctor` |
| `/bootstrap` | `handoff bootstrap --dry-run`, then `handoff bootstrap --yes` after confirmation |
| `/deps` | `handoff deps ...` |
