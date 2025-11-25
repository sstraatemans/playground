import nextConfig from '@config/eslint/profile/next/eslint.config.js';

export default [
  {
    ignores: ['.next/**', 'node_modules/**', '.turbo/**', 'dist/**'],
  },
  ...nextConfig,
  {
    // App-specific overrides (if any)
    files: ['**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },
];
