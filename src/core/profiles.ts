import os from 'node:os';
import path from 'node:path';
import type { DeviceConfig, ProfileName, ScopeConfig } from '../types.js';
import { DEFAULT_SCOPE } from './scope.js';
import { TOKENS } from './tokenize.js';

export const CODEX_SCOPE: ScopeConfig = {
  include: [
    'AGENTS.md',
    'config.toml',
    'hooks.json',
    'rules/**',
    'skills/**',
    'commands/**',
    '*.md',
  ],
  optIn: [],
  excludeExtra: [],
};

export interface AgentProfile {
  name: ProfileName;
  label: string;
  defaultDir: () => string;
  defaultScope: ScopeConfig;
  pathToken: string;
  dependencyHookFiles: string[];
}

const PROFILES: Record<ProfileName, AgentProfile> = {
  claude: {
    name: 'claude',
    label: 'Claude Code',
    defaultDir: () => path.join(os.homedir(), '.claude'),
    defaultScope: DEFAULT_SCOPE,
    pathToken: TOKENS.CLAUDE,
    dependencyHookFiles: ['hooks/hooks.json'],
  },
  codex: {
    name: 'codex',
    label: 'Codex',
    defaultDir: () => path.join(os.homedir(), '.codex'),
    defaultScope: CODEX_SCOPE,
    pathToken: TOKENS.CODEX,
    dependencyHookFiles: ['hooks.json'],
  },
};

export function getProfile(name: ProfileName | undefined): AgentProfile {
  return PROFILES[name ?? 'claude'];
}

export function resolveConfigAppDir(cfg: Pick<DeviceConfig, 'profile' | 'appDir' | 'claudeDir'>): string {
  if (cfg.appDir) return cfg.appDir;
  if ((cfg.profile ?? 'claude') === 'claude' && cfg.claudeDir) return cfg.claudeDir;
  return getProfile(cfg.profile).defaultDir();
}

export function normalizeConfigShape(raw: unknown): DeviceConfig {
  const cfg = raw as DeviceConfig;
  const profile = cfg.profile ?? 'claude';
  const appDir = cfg.appDir ?? (profile === 'claude' ? cfg.claudeDir : undefined) ?? getProfile(profile).defaultDir();
  return {
    ...cfg,
    profile,
    appDir,
    claudeDir: profile === 'claude' ? (cfg.claudeDir ?? appDir) : undefined,
  };
}
