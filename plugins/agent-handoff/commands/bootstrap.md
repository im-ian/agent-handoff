---
description: Install declared dependencies that are missing for this machine.
argument-hint: "[--dry-run]"
---

# Bootstrap Dependencies

Use a two-step flow so install commands are visible before execution.

1. Show the plan:
   ```bash
   handoff bootstrap --dry-run
   ```

2. If there is nothing to install, stop.

3. If install commands are listed, ask the user to confirm. Remind them that install commands come from the hub's `dependencies.json`.

4. After confirmation, run:
   ```bash
   handoff bootstrap --yes
   ```

5. Report succeeded and failed dependency installs.
