---
description: Pull another device's Codex setup into this machine.
argument-hint: "[--from <device>]"
---

# Pull Codex Setup

Preview before writing. Always pass `--from <device>` to avoid CLI device-picking prompts in non-TTY execution.

## Instructions

1. Read the current config and hub manifest.
   ```bash
   STATE_DIR="${AGENT_HANDOFF_HOME:-$HOME/.agent-handoff}"
   cat "$STATE_DIR/config.json"
   cat "$STATE_DIR/hub/manifest.json"
   ```

2. If `$ARGUMENTS` contains `--from <device>`, use that source. Otherwise pick the newest non-current device from the manifest, or ask the user when there is more than one reasonable source.

3. Preview:
   ```bash
   handoff pull --from <device> --dry-run
   handoff diff --from <device>
   ```

4. Ask the user to confirm applying the previewed files.

5. Apply without `--confirm` after confirmation:
   ```bash
   handoff pull --from <device>
   ```

6. Report source device, applied file count, and note that files outside scope are untouched and missing snapshot files are not deleted.
