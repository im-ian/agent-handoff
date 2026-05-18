import fg from 'fast-glob';
import type { ScopeConfig } from '../types.js';

export const DEFAULT_SCOPE: ScopeConfig = {
  include: [
    'agents/**',
    'commands/**',
    'hooks/**',
    'skills/**',
    'rules/**',
    'mcp-configs/**',
    'memory/**',
    '*.md',
  ],
  optIn: [],
  excludeExtra: [],
};

const HARD_DENY = [
  'projects/**',
  'sessions/**',
  'session-data/**',
  'session-env/**',
  'shell-snapshots/**',
  'cache/**',
  'paste-cache/**',
  'telemetry/**',
  'backups/**',
  'file-history/**',
  'ide/**',
  'tasks/**',
  'downloads/**',
  'read-once/**',
  'metrics/**',
  'homunculus/**',
  'ecc/**',
  '.agents/**',
  '.omc/**',
  // Plugin install dirs — pulling a snapshotted plugin would restore a stale
  // copy of agent-handoff (or any other plugin), defeating the marketplace
  // install path. Always install plugins via /plugin, never via handoff sync.
  'plugins/**',
  '**/agent-handoff/**',
  // Legacy install.sh symlinks for this plugin live in commands/handoff-*.md.
  // Same reason — don't sync them.
  'commands/handoff-*.md',
  '**/*.log',
  '**/*.jsonl',
  '**/.credentials.json',
  '**/.env',
  '**/.env.*',
  '**/*credentials*',
  '**/*secret*',
  '**/.DS_Store',
];

export async function listScopedFiles(root: string, scope: ScopeConfig): Promise<string[]> {
  const include = scope.include.length ? scope.include : DEFAULT_SCOPE.include;
  const ignore = [...HARD_DENY, ...scope.excludeExtra];
  const matches = await fg(include, {
    cwd: root,
    ignore,
    dot: false,
    onlyFiles: true,
    followSymbolicLinks: false,
  });
  return matches.sort();
}
