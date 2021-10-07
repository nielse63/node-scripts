module.exports = {
  presets: [['@babel/preset-env', { targets: { node: 'current' } }]],
  env: {
    build: {
      ignore: ['**/*.spec.js', '__snapshots__', '__tests__', '__stories__'],
    },
  },
  ignore: ['node_modules'],
};
