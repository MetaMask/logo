module.exports = {
  root: true,

  extends: ['@metamask/eslint-config', '@metamask/eslint-config-nodejs'],

  overrides: [
    {
      files: ['./demo/src/**/*.js', './src/index.js', './src/util.js'],
      globals: {
        Blob: true,
        document: true,
        window: true,
      },
    },
  ],

  ignorePatterns: ['!.eslintrc.js', '!.prettierrc.js', 'demo/dist/'],
};
