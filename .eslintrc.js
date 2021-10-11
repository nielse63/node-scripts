module.exports = {
  root: true,
  plugins: ['jest'],
  extends: [
    'airbnb-base',
    'prettier',
    'plugin:jest/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
  ],
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
    },
  ],
};
