module.exports = {
  root: true,
  extends: '@nielse63/eslint-config',
  plugins: ['jest-extended'],
  rules: {
    'import/no-extraneous-dependencies': [
      'warn',
      { devDependencies: ['**/*.test.ts', '**/*.spec.ts', '*.d.ts'] },
    ],
  },
  overrides: [
    {
      files: ['.bin/**/*', 'config/**/*.js'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
  ],
};
