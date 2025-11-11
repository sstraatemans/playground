import config from '@config/eslint';

export default [
  {
    ignores: ['node_modules/**', '.turbo/**', 'dist/**'],
  },
  ...config,
];
