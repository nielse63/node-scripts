module.exports = {
  root: true,
  plugins: ['jest'],
  extends: ['airbnb-base', 'prettier', 'plugin:jest/recommended'],
  overrides: [
    {
      files: ['.bin/**/*', '__tests__/**/*'],
      rules: {
        'import/no-extraneous-dependencies': 'off',
      },
    },
    {
      files: ['**/*.ts'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:import/typescript',
      ],
    },
  ],
};
