import { defineConfig } from 'vitest/config';

import { createPackageCiConfig } from '../../tests/vitest/create-package-ci-config.mjs';

export default defineConfig(
  createPackageCiConfig({
    thresholds: {
      branches: 8,
      functions: 15,
      lines: 15,
      statements: 15,
    },
  })
);
