/**
 * ESLint configuration for Next.js apps
 */
module.exports = {
  extends: ['./base.js', 'next/core-web-vitals'],
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
  },
};

