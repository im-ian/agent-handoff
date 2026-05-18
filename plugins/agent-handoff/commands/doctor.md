---
description: Diagnose missing external dependencies referenced by Codex hooks.
argument-hint: "[--verbose] [--fix]"
---

# Diagnose Codex Dependencies

Run:

```bash
handoff doctor $ARGUMENTS
```

Surface the output. For missing binaries, list whether each dependency is declared, has an install command for this platform, or needs a `handoff deps add ...` entry.
