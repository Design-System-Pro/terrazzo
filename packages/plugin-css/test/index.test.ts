import { build, defineConfig, parse } from '@terrazzo/parser';
import { describe, expect, test } from 'vitest';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import pluginCSS from '../src/index.js';

describe('@cobalt-ui/plugin-css', () => {
  test.each(['border', 'color', 'shadow', 'typography', 'transition'])('%s', async (dir) => {
    const cwd = new URL(`./${dir}/`, import.meta.url);
    const config = defineConfig({
      plugins: [
        pluginCSS({
          filename: 'actual.css',
          modeSelectors: [
            { mode: 'light', selectors: ['@media (prefers-color-scheme: light)'] },
            { mode: 'dark', selectors: ['@media (prefers-color-scheme: dark)'] },
            { mode: 'light', tokens: ['color.*'], selectors: ['[data-color-theme="light"]'] },
            { mode: 'dark', tokens: ['color.*'], selectors: ['[data-color-theme="dark"]'] },
            { mode: 'light-colorblind', tokens: ['color.*'], selectors: ['[data-color-theme="light-colorblind"]'] },
            {
              mode: 'light-high-contrast',
              tokens: ['color.*'],
              selectors: ['[data-color-theme="light-high-contrast"]'],
            },
            { mode: 'dark-dimmed', tokens: ['color.*'], selectors: ['[data-color-theme="dark-dimmed"]'] },
            {
              mode: 'dark-high-contrast',
              tokens: ['color.*'],
              selectors: ['[data-color-theme="dark-high-contrast"]'],
            },
            { mode: 'dark-colorblind', tokens: ['color.*'], selectors: ['[data-color-theme="dark-colorblind"]'] },
            { mode: 'desktop', selectors: ['@media (width >= 600px)'] },
          ],
        }),
      ],
    });
    const { tokens, ast } = await parse(fs.readFileSync(new URL('./tokens.json', cwd), 'utf8'), { config });
    await build({ tokens, ast, config });

    expect(fs.readFileSync(new URL('./actual.css', cwd), 'utf8')).toMatchFileSnapshot(
      fileURLToPath(new URL('./want.css', cwd)),
    );
  });
});
