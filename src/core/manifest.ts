import { promises as fs } from 'node:fs';
import path from 'node:path';
import type { DeviceVersion, HubManifest, ProfileName } from '../types.js';

const MANIFEST_FILE = 'manifest.json';

function emptyManifest(): HubManifest {
  return { version: 2, devices: {}, updatedAt: new Date().toISOString() };
}

export async function readManifest(hubDir: string): Promise<HubManifest> {
  const file = path.join(hubDir, MANIFEST_FILE);
  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    // v2 is the only supported shape — anything else is treated as empty.
    // Fresh v2 push will overwrite legacy v1 entries (per-device.latest).
    if (parsed && parsed.version === 2 && parsed.devices) {
      return parsed as HubManifest;
    }
    return emptyManifest();
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return emptyManifest();
    throw err;
  }
}

export async function writeManifest(hubDir: string, manifest: HubManifest): Promise<void> {
  const file = path.join(hubDir, MANIFEST_FILE);
  const next = { ...manifest, updatedAt: new Date().toISOString() };
  await fs.writeFile(file, JSON.stringify(next, null, 2) + '\n');
}

export async function upsertDevice(
  hubDir: string,
  device: string,
  profile: ProfileName,
  version: DeviceVersion,
): Promise<HubManifest> {
  const m = await readManifest(hubDir);
  const entry = m.devices[device] ?? {};
  entry[profile] = version;
  m.devices[device] = entry;
  await writeManifest(hubDir, m);
  return m;
}
