/* eslint-disable no-template-curly-in-string */

module.exports = {
  hooks: {
    'before:init': ['npm run lint', 'npm test'],
  },
  git: {
    commitMessage: 'chore: release v${version}',
    requireCleanWorkingDir: true,
    requireBranch: 'master',
  },
  github: {
    release: true,
  },
  npm: {
    publish: false,
  },
};
