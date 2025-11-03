import '@rushstack/eslint-config/patch/modern-module-resolution';

export default {
  extends: ['./profile/library/eslint.config.js'],
  parserOptions: {
    tsconfigRootDir: __dirname,
    // for js files
    ecmaVersion: 'latest',
  },
};
