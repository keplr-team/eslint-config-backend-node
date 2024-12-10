import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
// @ts-ignore
import { FlatCompat } from '@eslint/eslintrc';

// @ts-ignore
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  {
    ignores: ['**/node_modules/'],
  },
  ...compat.extends('./lib/index'),
  {
    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
      },
    },
  },
];

