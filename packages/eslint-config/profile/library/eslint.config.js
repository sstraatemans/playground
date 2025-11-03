import tseslint from 'typescript-eslint';
import eslintPluginImport from 'eslint-plugin-import';

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      'import': eslintPluginImport,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-template': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          fixStyle: 'separate-type-imports',
          prefer: 'type-imports',
        },
      ],
      'import/consistent-type-specifier-style': ['error', 'prefer-top-level'],
      'no-restricted-syntax': [
        'warn',
        {
          selector: 'TSEnumDeclaration',
          message: 'Use `Record<string, string|number>` with `as const` instead.',
        },
      ],
    },
  },
];
