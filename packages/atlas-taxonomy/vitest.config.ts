import { defineConfig } from 'vitest/config';

import { createPackageCiConfig } from '../../tests/vitest/create-package-ci-config.mjs';

export default defineConfig(
  createPackageCiConfig({
    thresholds: {
      branches: 50,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  })
);
