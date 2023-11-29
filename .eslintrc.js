const environmentRules = require('@metamask/eslint-config/src/environment.json');

module.exports = {
  root: true,

  extends: ['@metamask/eslint-config', '@metamask/eslint-config-nodejs'],

  rules: {
    // The JSDoc plugin doesn't seem to like template string types.
    'jsdoc/valid-types': 'off',
  },

  overrides: [
    {
      files: ['./demo/src/**/*.js', './src/*.js'],
      extends: ['@metamask/eslint-config-browser'],
      rules: {
        // We use Node syntax in these files, so that should continue to be
        // allowed. However, we also need to allow browser-specific globals.
        'no-restricted-globals': [
          'error',
          ...environmentRules['no-restricted-globals'].filter((rule) => {
            return !['document', 'module', 'require', 'window'].includes(
              rule.name,
            );
          }),
        ],
        // It is fine to shadow the global `event`.
        'no-shadow': ['error', { allow: ['event'] }],
      },
    },
  ],

  ignorePatterns: [
    '!.eslintrc.js',
    '!.prettierrc.js',
    'dist/',
    'demo/dist/',
    'docs/',
    '.yarn/',
  ],

  settings: {
    jsdoc: {
      mode: 'typescript',
    },
  },
};
