/**
 * Default README written into a freshly created hub repo. Embeds the recovery
 * playbook so the hub itself documents how to restore from it — including the
 * dependency-loop note that the agent-handoff plugin is intentionally not
 * synced through the hub and must be installed via the marketplace first.
 *
 * `{{hubName}}` is replaced at write time.
 */
export const HUB_README_TEMPLATE = `# {{hubName}}

Private hub for [agent-handoff](https://github.com/im-ian/agent-handoff). Stores tokenized snapshots of each registered machine's Claude Code / Codex setup so other machines can pull them.

> **Keep this repository private.** Even with tokenization, the hub holds device names, real \`~/.claude/\` (or \`~/.codex/\`) file contents, and may surface secrets the scanner missed.

## Layout

\`\`\`
<this repo>/
├── devices/<name>/
│   ├── snapshot/            # tokenized scoped files by agent profile
│   │   ├── .claude/
│   │   └── .codex/
│   ├── version.json         # last push timestamp, file count, byte count
│   └── dependencies.json    # declared external CLI deps for this device
└── manifest.json            # registry of known devices and their latest push
\`\`\`

One commit on this repo = one profile push from one device. The agent-handoff CLI never cross-merges devices; \`handoff pull --from <device>\` applies the source device's snapshot for the current profile atomically.

## Restoring on a new machine

The agent-handoff plugin is intentionally **not** synced through the hub — pulling an old machine's snapshot would otherwise overwrite the plugin with a stale copy. Install it directly from the marketplace before touching the hub:

1. Install Claude Code (or Codex) and authenticate \`gh\`.
2. Install the agent-handoff plugin:
   \`\`\`
   /plugin marketplace add im-ian/agent-handoff
   /plugin install agent-handoff@agent-handoff
   /reload-plugins
   \`\`\`
3. Install the CLI (terminal):
   \`\`\`bash
   npm install -g @im-ian/agent-handoff
   \`\`\`
4. Initialize against this hub:
   \`\`\`
   /agent-handoff:init
   \`\`\`
   Provide this repo's clone URL and pick a device name.
5. Apply another machine's setup:
   \`\`\`
   /agent-handoff:pull
   \`\`\`
   Pick the source device, review the diff, confirm.

## Day-to-day commands

| Slash | CLI | Purpose |
|---|---|---|
| \`/agent-handoff:push\` | \`handoff push\` | Snapshot this machine to the hub |
| \`/agent-handoff:pull\` | \`handoff pull\` | Apply another machine's snapshot |
| \`/agent-handoff:diff\` | \`handoff diff\` | Preview what pull would change |
| \`/agent-handoff:status\` | \`handoff status\` | List registered devices and last push |
| \`/agent-handoff:doctor\` | \`handoff doctor\` | Find missing external deps used by hooks |
| \`/agent-handoff:bootstrap\` | \`handoff bootstrap\` | Install declared deps that are missing |

Arguments pass through: \`/agent-handoff:pull --from work-pc --confirm\` works exactly as expected.

## Notes

- Snapshots are tokenized: absolute paths like \`/Users/alice/.claude/hooks/x.sh\` become \`\${HANDOFF_CLAUDE}/hooks/x.sh\` so they resolve correctly on each machine.
- The secret scanner runs on every push; you can whitelist files via \`secretPolicy.allow\` in \`~/.agent-handoff/config.json\` when a finding is a known false positive.
- See [agent-handoff/docs/DESIGN.md](https://github.com/im-ian/agent-handoff/blob/main/docs/DESIGN.md) for the full schema and architecture.
`;

export function renderHubReadme(hubName: string): string {
  return HUB_README_TEMPLATE.replace(/\{\{hubName\}\}/g, hubName);
}
