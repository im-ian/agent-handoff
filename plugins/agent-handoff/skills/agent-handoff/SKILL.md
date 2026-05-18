---
name: agent-handoff
description: Use when syncing Codex or Claude Code agent setup across devices with the handoff CLI, including init, status, push, pull, diff, doctor, bootstrap, or dependency manifest work.
---

# Agent Handoff

Use the `handoff` CLI on `PATH`. In Codex, prefer the Codex profile by passing `--profile codex` during initialization. Do not assume plugin slash commands exist in Codex; run terminal commands or use shell tools directly.

## Basic Commands

- Check installation: `command -v handoff` and `handoff --version`.
- Show current state: `handoff status`.
- Initialize Codex: `handoff init --profile codex --hub <git-url> --device <device-name>`.
- Create a new private hub when requested: `handoff init --profile codex --create-hub <repo-name> --device <device-name>`.
- Push this machine: run `handoff push --dry-run` first unless the user already provided a secret policy flag.
- Pull another machine: run `handoff pull --from <device> --dry-run` and `handoff diff --from <device>` before applying.
- Diagnose dependencies: `handoff doctor`.
- Install declared dependencies: run `handoff bootstrap --dry-run`, ask for confirmation, then `handoff bootstrap --yes`.
- Manage dependency declarations: `handoff deps list`, `handoff deps add <name> --darwin "<cmd>" --linux "<cmd>"`, or `handoff deps remove <name>`.

## Safety

For `push`, if `handoff push --dry-run` reports secret findings, summarize the files and ask whether to skip flagged files, upload everything, or abort. Use `handoff push --skip-on-secrets` for the conservative path and `handoff push --allow-secrets` only when the user explicitly chooses it.

For `pull`, always preview before writing. If multiple source devices are available and the user did not specify one, inspect the manifest or ask which device to pull from.

## Reporting

Report the profile, app directory, hub URL, device name, changed file count, skipped files, and short commit SHA when those details are available in CLI output.
