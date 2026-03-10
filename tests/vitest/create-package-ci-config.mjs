export function createPackageCiConfig({ thresholds }) {
  return {
    test: {
      include: ['test/**/*.test.ts'],
      reporters: ['default', 'junit'],
      outputFile: {
        junit: './test-results/junit.xml',
      },
      coverage: {
        enabled: true,
        provider: 'v8',
        reportsDirectory: './coverage',
        reporter: ['text-summary', 'lcov', 'json-summary'],
        all: true,
        include: ['src/**/*.ts'],
        exclude: ['**/*.test.ts', 'test/**', 'tests/**', 'dist/**'],
        thresholds,
      },
    },
  };
}
