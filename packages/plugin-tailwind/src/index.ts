import type { BuildResult, ParsedToken, Plugin } from '@cobalt-ui/core';
import { indent, objKey } from '@cobalt-ui/utils';
import { defaultTransformer } from '@cobalt-ui/plugin-css';
import type { Config } from 'tailwindcss';

export interface Options {
  /** output file (default: "./tailwind-tokens.js") */
  filename?: string;
  /** (optional) module format to use (to match your Tailwind config) */
  format?: 'esm' | 'cjs';
  /** (optional) Transform token value */
  transform?: <T extends ParsedToken>(token: T, metadata: Record<string, unknown>) => string | number | string[] | undefined;
  /** @see https://tailwindcss.com/docs/theme */
  tailwind: {
    theme: Config['theme'];
  };
}

const PREFIX = `/**
 * Design Tokens
 * Autogenerated from tokens.json.
 * DO NOT EDIT!
 */

`;

export default function pluginTailwind(options: Options): Plugin {
  if (!options?.tailwind?.theme) {
    throw new Error(`options.tailwind.theme is required`);
  }
  if (Array.isArray(typeof options.tailwind.theme) || typeof options.tailwind.theme !== 'object') {
    throw new Error(`options.tailwind.theme: expected object, received ${Array.isArray(options.tailwind.theme) ? 'array' : typeof options.tailwind.theme}`);
  }

  return {
    name: '@cobalt-ui/plugin-tailwind',
    async build({ tokens, metadata }): Promise<BuildResult[]> {
      /** walk through Tailwind’s theme object */
      function walk(node: any, path: (string | number)[] = []): string {
        const output: string[] = [];
        if (node === undefined || node === null) {
          return '';
        }
        if (typeof node === 'function') {
          throw new Error(`Can’t use \`({ theme }) => theme(…)\` syntax inside @cobalt-ui/plugin-tailwind. Specify aliases in your Tailwind config instead.`);
        }
        if (typeof node === 'string') {
          const token = tokens.find((t) => t.id === node);
          if (!token) {
            throw new Error(`Can’t find token "${node}"`);
          }
          let value = options.transform?.(token, metadata);
          if (value === undefined || value === null) {
            if (token.$type === 'fontFamily') {
              return JSON.stringify(token.$value);
            }
            const nextValue = defaultTransformer(token, { colorFormat: 'none' });
            if (typeof nextValue === 'object') {
              throw new Error(`Unsupported token type: "${token.$type}"`);
            }
            value = JSON.stringify(nextValue);
          }
          return value as string;
        }
        if (Array.isArray(node)) {
          output.push('[');
          for (let i = 0; i < node.length; i++) {
            output.push(indent(`${walk(node[i], [...path, i])},`, path.length + 1));
          }
          output.push(indent(']', path.length));
          return output.join('\n');
        }
        if (typeof node === 'object') {
          output.push('{');
          for (const [k, v] of Object.entries(node)) {
            output.push(indent(`${objKey(k)}: ${walk(v, [...path, k])},`, path.length + 1));
          }
          output.push(indent('}', path.length));
          return output.join('\n');
        }
        throw new Error(`Expected token ID, received "${node}"`);
      }

      return [
        {
          filename: options?.filename ?? './tailwind-tokens.js',
          contents: `${PREFIX}${options?.format === 'cjs' ? `module.exports = ` : `export default `}${walk(options.tailwind.theme)};
`,
        },
      ];
    },
  };
}
