module.exports = (api) => {
  api.cache(true);

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          useBuiltIns: 'usage',
          corejs: 3,
          targets: { node: '12' },
        },
      ],
      '@babel/preset-typescript',
    ],
    env: {
      build: {
        ignore: [
          '**/*.spec.js',
          '**/*.spec.ts',
          '**/__tests__/**',
          '**/__mocks__/**',
        ],
      },
    },
    ignore: ['node_modules'],
  };
};
