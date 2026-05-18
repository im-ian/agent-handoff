import { describe, expect, it } from 'vitest';
import { HUB_README_TEMPLATE, renderHubReadme } from './hub-readme.js';

describe('renderHubReadme', () => {
  it('substitutes the hub name into the H1 heading', () => {
    const rendered = renderHubReadme('my-hub-2024');
    expect(rendered).toMatch(/^# my-hub-2024\n/);
    expect(rendered).not.toContain('{{hubName}}');
  });

  it('includes the marketplace install path before mentioning pull', () => {
    const rendered = renderHubReadme('hub');
    const marketplaceIdx = rendered.indexOf('/plugin marketplace add');
    const pullIdx = rendered.indexOf('/agent-handoff:pull');
    expect(marketplaceIdx).toBeGreaterThan(-1);
    expect(pullIdx).toBeGreaterThan(marketplaceIdx);
  });

  it('keeps the unrendered template free of substitution leaks', () => {
    expect(HUB_README_TEMPLATE).toContain('{{hubName}}');
  });
});
