import { defineConfig } from 'vitest/config';

import { createPackageCiConfig } from '../../tests/vitest/create-package-ci-config.mjs';

export default defineConfig(
  createPackageCiConfig({
    thresholds: {
      branches: 60,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  })
);
