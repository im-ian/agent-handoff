---
description: Register this machine for Codex handoff and link or create a hub repository.
argument-hint: "[--hub <url> | --create-hub <name>] [--device <name>] [--app-dir <path>] [--skip-clone]"
---

# Initialize Codex Handoff

Use this command to initialize `agent-handoff` for the Codex profile. Always pass `--profile codex` to the CLI.

## Instructions

1. Check whether `handoff` is on `PATH`.
   ```bash
   command -v handoff
   ```
   If missing, tell the user to install the CLI from this repository first.

2. Inspect current state.
   ```bash
   STATE_DIR="${AGENT_HANDOFF_HOME:-${CLAUDE_HANDOFF_HOME:-$HOME/.agent-handoff}}"
   if [ ! -f "$STATE_DIR/config.json" ] && [ -f "$HOME/.claude-handoff/config.json" ]; then
     STATE_DIR="$HOME/.claude-handoff"
   fi
   test -f "$STATE_DIR/config.json" && cat "$STATE_DIR/config.json" || echo "NO_CONFIG"
   ```

3. If `$ARGUMENTS` already includes hub/device details, run:
   ```bash
   handoff init --profile codex $ARGUMENTS
   ```

4. If required details are missing, ask the user for:
   - hub URL or a new private GitHub repo name
   - device name
   - optional app directory override, defaulting to `~/.codex`

5. Run one assembled command with all answers as flags so the CLI does not open an interactive prompt:
   ```bash
   handoff init --profile codex --hub <url> --device <device>
   handoff init --profile codex --create-hub <repo> --device <device>
   ```

6. Report the written config path, device name, hub URL, and suggest `/push` next.
