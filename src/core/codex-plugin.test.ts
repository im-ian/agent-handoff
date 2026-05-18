import { describe, expect, it } from 'vitest';
import { promises as fs } from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..', '..');
const pluginRoot = path.join(repoRoot, 'plugins', 'agent-handoff');

describe('Codex plugin packaging', () => {
  it('declares a valid Codex plugin manifest', async () => {
    const raw = await fs.readFile(path.join(pluginRoot, '.codex-plugin', 'plugin.json'), 'utf8');
    const manifest = JSON.parse(raw) as {
      name?: string;
      description?: string;
      repository?: string;
      skills?: string;
      interface?: { displayName?: string; defaultPrompt?: string[] };
    };

    expect(manifest.name).toBe('agent-handoff');
    expect(manifest.description).toContain('Codex');
    expect(manifest.repository).toContain('agent-handoff');
    expect(manifest.skills).toBe('./skills/');
    expect(manifest.interface?.displayName).toBe('Agent Handoff');
    expect(manifest.interface?.defaultPrompt).toHaveLength(3);
  });

  it('ships the expected Codex CLI workflow docs', async () => {
    const commandsDir = path.join(pluginRoot, 'commands');
    const files = (await fs.readdir(commandsDir)).sort();

    expect(files).toEqual([
      'bootstrap.md',
      'deps.md',
      'diff.md',
      'doctor.md',
      'init.md',
      'pull.md',
      'push.md',
      'status.md',
    ]);

    const init = await fs.readFile(path.join(commandsDir, 'init.md'), 'utf8');
    expect(init).toContain('handoff init --profile codex');
  });

  it('ships a Codex skill entrypoint', async () => {
    const skill = await fs.readFile(path.join(pluginRoot, 'skills', 'agent-handoff', 'SKILL.md'), 'utf8');

    expect(skill).toContain('name: agent-handoff');
    expect(skill).toContain('handoff init --profile codex');
    expect(skill).toContain('Do not assume plugin slash commands exist in Codex');
  });
});
