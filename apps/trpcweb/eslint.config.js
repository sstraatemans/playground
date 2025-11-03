export default [
  {
    extends: [
      '@config/eslint/profile/next/eslint.config.js',
      '@config/eslint',
      'next/core-web-vitals',
    ],
    // App-specific overrides (if any)
    files: ['**/*.tsx'],
    rules: {
      'react/prop-types': 'off',
    },
  },
];
