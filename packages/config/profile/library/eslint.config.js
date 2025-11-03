import { join } from 'node:path';

/** @type {import("@types/eslint").Linter.Config} */
export default {
  root: true,
  extends: ['@rushstack/eslint-config/profile/node', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-template': 'warn',
    'import/no-unresolved': 'error',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'error',
      {
        fixStyle: 'separate-type-imports',
        prefer: 'type-imports',
      },
    ],
    'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
    '@rushstack/typedef-var': 'off',
    'no-restricted-syntax': [
      'warn',
      {
        selector: 'TSEnumDeclaration',
        message: 'Use `Record<string, string|number>` with `as const` instead.',
      },
    ],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      node: true,
      typescript: {
        project: [join(process.cwd(), 'tsconfig.json')],
      },
    },
  },
};
