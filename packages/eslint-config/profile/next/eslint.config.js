import baseConfig from '../library/eslint.config.js';
// @ts-expect-error - eslint-plugin-next doesn't have proper types
import pluginNext from '@next/eslint-plugin-next';

export default [
  ...baseConfig,
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    plugins: {
      '@next/next': pluginNext,
    },
    rules: {
      ...pluginNext.configs.recommended.rules,
      ...pluginNext.configs['core-web-vitals'].rules,
    },
  },
];
