import { promises as fs } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DEFAULT_SCOPE, listScopedFiles } from './scope.js';
import { CODEX_SCOPE } from './profiles.js';

async function touch(root: string, rel: string): Promise<void> {
  const full = path.join(root, rel);
  await fs.mkdir(path.dirname(full), { recursive: true });
  await fs.writeFile(full, '');
}

describe('listScopedFiles — memory backup coverage', () => {
  let root = '';

  beforeEach(async () => {
    root = await fs.mkdtemp(path.join(os.tmpdir(), 'agent-handoff-scope-'));
  });

  afterEach(async () => {
    await fs.rm(root, { recursive: true, force: true });
  });

  it('includes Claude memory/** files under default scope', async () => {
    await touch(root, 'memory/MEMORY.md');
    await touch(root, 'memory/feedback_x.md');
    await touch(root, 'memory/notes/nested.md');
    await touch(root, 'CLAUDE.md');

    const files = await listScopedFiles(root, DEFAULT_SCOPE);

    expect(files).toContain('memory/MEMORY.md');
    expect(files).toContain('memory/feedback_x.md');
    expect(files).toContain('memory/notes/nested.md');
    expect(files).toContain('CLAUDE.md');
  });

  it('includes Codex memories/** files under codex scope', async () => {
    await touch(root, 'memories/note.md');
    await touch(root, 'AGENTS.md');

    const files = await listScopedFiles(root, CODEX_SCOPE);

    expect(files).toContain('memories/note.md');
    expect(files).toContain('AGENTS.md');
  });

  it('still rejects credentials inside memory via HARD_DENY', async () => {
    await touch(root, 'memory/safe.md');
    await touch(root, 'memory/leaked.credentials.json');
    await touch(root, 'memory/.env.local');

    const files = await listScopedFiles(root, DEFAULT_SCOPE);

    expect(files).toContain('memory/safe.md');
    expect(files).not.toContain('memory/leaked.credentials.json');
    expect(files).not.toContain('memory/.env.local');
  });
});
