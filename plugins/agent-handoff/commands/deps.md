---
description: Manage this device's declared external dependencies.
argument-hint: "add <name> [--darwin <cmd>] [--linux <cmd>] [--description <text>] | list | remove <name>"
---

# Manage Handoff Dependencies

Run:

```bash
handoff deps $ARGUMENTS
```

Common examples:

```bash
handoff deps list
handoff deps add gh --darwin "brew install gh" --linux "apt install gh"
handoff deps remove gh
```

Surface CLI output and any commit/push SHA from dependency manifest edits.
