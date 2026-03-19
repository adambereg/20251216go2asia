const workerConfig = require('@go2asia/config/eslint/worker');

module.exports = {
  ...workerConfig,
  parserOptions: {
    ...(workerConfig.parserOptions ?? {}),
    project: './tsconfig.eslint.json',
    tsconfigRootDir: __dirname,
  },
};
