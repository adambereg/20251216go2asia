import { defineConfig } from 'orval';

/**
 * Orval configuration for generating types and SDK from OpenAPI specs
 * 
 * This config generates:
 * - Types: packages/types/src/generated.ts
 * - SDK: packages/sdk/src/generated.ts
 */
export default defineConfig({
  types: {
    input: {
      target: './docs/openapi/openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './packages/types/src/generated.ts',
      schemas: './packages/types/src/generated',
      client: 'axios', // Orval requires a client, but we'll only use types
      mock: false,
      override: {
        operations: {},
        mutator: {
          path: './packages/types/src/mutator.ts',
          name: 'noopMutator',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
  sdk: {
    input: {
      target: './docs/openapi/openapi.yaml',
    },
    output: {
      mode: 'split',
      target: './packages/sdk/src/generated.ts',
      schemas: './packages/sdk/src/generated',
      client: 'fetch',
      mock: false,
      override: {
        mutator: {
          path: './packages/sdk/src/mutator.ts',
          name: 'customInstance',
        },
      },
    },
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});

