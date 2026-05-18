import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DEFAULT_SCOPE } from './scope.js';
import {
  CODEX_SCOPE,
  getProfile,
  normalizeConfigShape,
  resolveConfigAppDir,
} from './profiles.js';

describe('agent profiles', () => {
  it('defaults profile to claude and backfills appDir when missing', () => {
    const cfg = normalizeConfigShape({
      device: 'macbook',
      hubRemote: 'git@github.com:me/hub.git',
      substitutions: [],
      scope: DEFAULT_SCOPE,
      secretPolicy: { allow: [] },
    });

    expect(cfg.profile).toBe('claude');
    expect(cfg.appDir).toBe(path.join(os.homedir(), '.claude'));
  });

  it('normalizes codex configs to the codex profile and app directory', () => {
    const cfg = normalizeConfigShape({
      profile: 'codex',
      device: 'macbook',
      hubRemote: 'git@github.com:me/hub.git',
      appDir: '/Users/me/.codex',
      substitutions: [],
      scope: CODEX_SCOPE,
      secretPolicy: { allow: [] },
    });

    expect(cfg.profile).toBe('codex');
    expect(cfg.appDir).toBe('/Users/me/.codex');
  });

  it('provides profile-specific defaults', () => {
    const claude = getProfile('claude');
    const codex = getProfile('codex');

    expect(claude.defaultDir()).toBe(path.join(os.homedir(), '.claude'));
    expect(codex.defaultDir()).toBe(path.join(os.homedir(), '.codex'));
    expect(claude.snapshotDirName).toBe('.claude');
    expect(codex.snapshotDirName).toBe('.codex');
    expect(codex.defaultScope.include).toContain('AGENTS.md');
    expect(codex.defaultScope.include).toContain('skills/**');
    expect(codex.defaultScope.excludeExtra).toEqual([]);
  });

  it('resolves an app dir from normalized config', () => {
    const cfg = normalizeConfigShape({
      profile: 'codex',
      device: 'macbook',
      hubRemote: 'git@github.com:me/hub.git',
      substitutions: [],
      scope: CODEX_SCOPE,
      secretPolicy: { allow: [] },
    });

    expect(resolveConfigAppDir(cfg)).toBe(path.join(os.homedir(), '.codex'));
  });
});
