import { defineConfig } from 'vitest/config';

import { createPackageCiConfig } from '../../tests/vitest/create-package-ci-config.mjs';

export default defineConfig(
  createPackageCiConfig({
    thresholds: {
      branches: 10,
      functions: 20,
      lines: 20,
      statements: 20,
    },
  })
);
