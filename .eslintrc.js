module.exports = {
  env: {
    es6: true,
    browser: true,
  },
  extends: [
    '@metamask/eslint-config',
    '@metamask/eslint-config/config/nodejs',
  ],
  plugins: [
    'json',
  ],
  parserOptions: {
    ecmaVersion: 2017,
  },
  ignorePatterns: [
    '!.eslintrc.js',
    'node_modules/',
    'bundle.js',
  ],
  rules: {
    'no-bitwise': 'off',
    'no-mixed-operators': 'off',
    'prefer-destructuring': [
      'error', { 'array': false, 'object': true },
    ],
  },
}
