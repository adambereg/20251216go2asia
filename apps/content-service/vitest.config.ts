import { defineConfig } from 'vitest/config';

import { createPackageCiConfig } from '../../tests/vitest/create-package-ci-config.mjs';

export default defineConfig(
  createPackageCiConfig({
    thresholds: {
      branches: 2,
      functions: 5,
      lines: 5,
      statements: 5,
    },
  })
);
