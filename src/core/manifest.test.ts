import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { readManifest, upsertDevice, writeManifest } from './manifest.js';

describe('hub manifest (v2, per-profile)', () => {
  let hubDir = '';

  beforeEach(async () => {
    hubDir = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-handoff-manifest-'));
  });

  afterEach(async () => {
    await fs.rm(hubDir, { recursive: true, force: true });
  });

  it('returns an empty v2 manifest when none exists', async () => {
    const m = await readManifest(hubDir);
    expect(m.version).toBe(2);
    expect(m.devices).toEqual({});
  });

  it('treats legacy v1 manifests on disk as empty (no migration)', async () => {
    await fs.writeFile(
      path.join(hubDir, 'manifest.json'),
      JSON.stringify({
        version: 1,
        devices: { mac: { latest: { pushedAt: '2024-01-01T00:00:00Z', host: 'h', fileCount: 1, byteCount: 1 } } },
        updatedAt: '2024-01-01T00:00:00Z',
      }),
    );

    const m = await readManifest(hubDir);
    expect(m.version).toBe(2);
    expect(m.devices).toEqual({});
  });

  it('upserts one profile per device and preserves the other', async () => {
    await upsertDevice(hubDir, 'mac', 'claude', {
      pushedAt: '2026-05-18T00:00:00Z',
      host: 'mac.local',
      fileCount: 449,
      byteCount: 2_502_175,
    });
    await upsertDevice(hubDir, 'mac', 'codex', {
      pushedAt: '2026-05-18T01:00:00Z',
      host: 'mac.local',
      fileCount: 224,
      byteCount: 1_726_121,
    });

    const m = await readManifest(hubDir);
    expect(Object.keys(m.devices)).toEqual(['mac']);
    expect(m.devices.mac?.claude?.fileCount).toBe(449);
    expect(m.devices.mac?.codex?.fileCount).toBe(224);
  });

  it('overwrites only the matching profile entry on re-push', async () => {
    await upsertDevice(hubDir, 'mac', 'claude', {
      pushedAt: '2026-05-18T00:00:00Z', host: 'mac', fileCount: 100, byteCount: 1000,
    });
    await upsertDevice(hubDir, 'mac', 'codex', {
      pushedAt: '2026-05-18T01:00:00Z', host: 'mac', fileCount: 200, byteCount: 2000,
    });
    await upsertDevice(hubDir, 'mac', 'claude', {
      pushedAt: '2026-05-18T02:00:00Z', host: 'mac', fileCount: 150, byteCount: 1500,
    });

    const m = await readManifest(hubDir);
    expect(m.devices.mac?.claude?.fileCount).toBe(150);
    expect(m.devices.mac?.codex?.fileCount).toBe(200);
  });

  it('stamps updatedAt on every write', async () => {
    await writeManifest(hubDir, { version: 2, devices: {}, updatedAt: '1970-01-01T00:00:00Z' });
    const m = await readManifest(hubDir);
    expect(new Date(m.updatedAt).getTime()).toBeGreaterThan(new Date('1970-01-01T00:00:00Z').getTime());
  });
});
