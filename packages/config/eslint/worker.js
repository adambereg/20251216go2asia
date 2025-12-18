/**
 * ESLint configuration for Cloudflare Workers
 */
const base = require('./base');

module.exports = {
  ...base,
  rules: {
    ...(base.rules ?? {}),
    'no-restricted-globals': [
      'error',
      {
        name: 'window',
        message: 'Use globalThis instead of window in Cloudflare Workers',
      },
      {
        name: 'document',
        message: 'document is not available in Cloudflare Workers',
      },
    ],
  },
};





