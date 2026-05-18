---
description: Preview Codex handoff changes without applying them.
argument-hint: "[--from <device>] [--patch] [--files-only]"
---

# Diff Codex Setup

Run:

```bash
handoff diff $ARGUMENTS
```

Surface the diff summary. If `--patch` is requested, include the relevant unified patches and keep secret-looking values masked if the output contains any.
