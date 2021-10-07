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
  ],
};
