import path from 'node:path';
import { promises as fs } from 'node:fs';
import type { DependencyEntry, DependencyManifest, ProfileName } from '../types.js';

const MANIFEST_FILE = 'dependencies.json';

/**
 * Shape of `devices/<name>/dependencies.json` on disk.
 *
 * Keyed by profile so both Claude and Codex deps can live in one file,
 * mirroring the per-profile structure of `manifest.json`.
 */
type OnDiskShape = Partial<Record<ProfileName, DependencyManifest>>;

function manifestPath(deviceDir: string): string {
  return path.join(deviceDir, MANIFEST_FILE);
}

function emptyProfileEntry(): DependencyManifest {
  return { version: 1, dependencies: {} };
}

async function readWholeFile(deviceDir: string): Promise<OnDiskShape> {
  try {
    const raw = await fs.readFile(manifestPath(deviceDir), 'utf8');
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as OnDiskShape;
    }
    return {};
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return {};
    throw err;
  }
}

export async function readManifest(
  deviceDir: string,
  profile: ProfileName,
): Promise<DependencyManifest> {
  const all = await readWholeFile(deviceDir);
  const entry = all[profile];
  if (!entry) return emptyProfileEntry();
  if (!entry.dependencies) entry.dependencies = {};
  if (!entry.version) entry.version = 1;
  return entry;
}

export async function writeManifest(
  deviceDir: string,
  profile: ProfileName,
  manifest: DependencyManifest,
): Promise<void> {
  const all = await readWholeFile(deviceDir);
  all[profile] = manifest;
  await fs.mkdir(deviceDir, { recursive: true });
  await fs.writeFile(manifestPath(deviceDir), JSON.stringify(all, null, 2) + '\n');
}

/**
 * Look up the install command for the current platform. Returns undefined
 * when the entry has no command for `process.platform`.
 */
export function getInstallForPlatform(entry: DependencyEntry): string | undefined {
  const platform = process.platform;
  if (platform === 'darwin') return entry.install.darwin;
  if (platform === 'linux') return entry.install.linux;
  return undefined;
}

/**
 * Check whether a binary is on PATH. Uses the shell builtin `command -v`,
 * which is portable and respects the user's current PATH/aliases.
 */
const VALID_BINARY = /^[a-zA-Z0-9_.+-]+$/;
export async function isInstalled(binary: string): Promise<boolean> {
  if (!VALID_BINARY.test(binary)) return false;
  const { execa } = await import('execa');
  const r = await execa('command', ['-v', binary], { reject: false, shell: true });
  return r.exitCode === 0 && r.stdout.trim().length > 0;
}
