# @go2asia/config

Shared configuration for Go2Asia monorepo (ESLint, TypeScript, Prettier).

## Usage

### ESLint

```js
// .eslintrc.js
module.exports = require('@go2asia/config/eslint/base');
// or
module.exports = require('@go2asia/config/eslint/next');
// or
module.exports = require('@go2asia/config/eslint/worker');
```

### TypeScript

```json
// tsconfig.json
{
  "extends": "@go2asia/config/typescript/base.json"
}
// or
{
  "extends": "@go2asia/config/typescript/next.json"
}
// or
{
  "extends": "@go2asia/config/typescript/worker.json"
}
```

### Prettier

```js
// .prettierrc.js
module.exports = require('@go2asia/config/prettier');
```

