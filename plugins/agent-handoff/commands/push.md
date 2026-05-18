---
description: Push this machine's Codex setup to the handoff hub.
argument-hint: "[--skip-on-secrets | --allow-secrets] [-m <message>]"
---

# Push Codex Setup

Drive a non-hanging push flow. Do not run an interactive `handoff push` when secret findings exist unless an explicit policy flag is present.

## Instructions

1. If `$ARGUMENTS` contains `--skip-on-secrets` or `--allow-secrets`, run it directly:
   ```bash
   handoff push $ARGUMENTS
   ```

2. Otherwise run a preflight:
   ```bash
   handoff push --dry-run
   ```

3. If the dry-run reports no secret findings, run:
   ```bash
   handoff push $ARGUMENTS
   ```

4. If secret findings are reported, summarize the files and hub visibility. Ask the user whether to:
   - skip flagged files, then run `handoff push --skip-on-secrets $ARGUMENTS`
   - upload everything, then run `handoff push --allow-secrets $ARGUMENTS`
   - abort

5. Report file count, skipped files if any, short SHA, and hub URL.
