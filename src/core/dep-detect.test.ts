import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { detectDeps } from './dep-detect.js';

async function write(root: string, rel: string, content: string): Promise<void> {
  const full = path.join(root, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, content);
}

describe('detectDeps', () => {
  let root = '';

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-handoff-deps-'));
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it('detects Claude hook dependencies by default', async () => {
    await write(root, 'hooks/hooks.json', JSON.stringify({ command: 'rtk run task' }));

    const refs = await detectDeps(root);

    expect(refs.map((r) => r.binary)).toEqual(['rtk']);
    expect(refs[0]?.file).toBe('hooks/hooks.json');
  });

  it('detects Codex top-level hook dependencies when requested', async () => {
    await write(root, 'hooks.json', JSON.stringify({ command: 'rtk run task' }));

    const refs = await detectDeps(root, ['hooks.json']);

    expect(refs.map((r) => r.binary)).toEqual(['rtk']);
    expect(refs[0]?.file).toBe('hooks.json');
  });
});
