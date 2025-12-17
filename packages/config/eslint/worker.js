/**
 * ESLint configuration for Cloudflare Workers
 */
module.exports = {
  extends: ['./base.js'],
  env: {
    'cloudflare-workers': true,
  },
  rules: {
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

