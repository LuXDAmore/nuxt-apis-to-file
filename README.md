# @luxdamore/nuxt-apis-to-file

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Nuxt module to merge and transform API calls into a file

[📖 **Release Notes**](./CHANGELOG.md)

## Setup

1. Add `@luxdamore/nuxt-apis-to-file` dependency to your project

```bash
yarn add @luxdamore/nuxt-apis-to-file # or npm install @luxdamore/nuxt-apis-to-file
```

2. Add `@luxdamore/nuxt-apis-to-file` to the `modules` section of `nuxt.config.js`

```js
{
  modules: [
    // Simple usage
    '@luxdamore/nuxt-apis-to-file',

    // With options
    ['@luxdamore/nuxt-apis-to-file', { /* module options */ }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Luca Iaconelli <lucabelli@msn.com>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@luxdamore/nuxt-apis-to-file/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@luxdamore/nuxt-apis-to-file

[npm-downloads-src]: https://img.shields.io/npm/dt/@luxdamore/nuxt-apis-to-file.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@luxdamore/nuxt-apis-to-file

[circle-ci-src]: https://img.shields.io/circleci/project/github/LuXDAmore/nuxt-apis-to-file.svg?style=flat-square
[circle-ci-href]: https://circleci.com/gh/LuXDAmore/nuxt-apis-to-file

[codecov-src]: https://img.shields.io/codecov/c/github/LuXDAmore/nuxt-apis-to-file.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/LuXDAmore/nuxt-apis-to-file

[license-src]: https://img.shields.io/npm/l/@luxdamore/nuxt-apis-to-file.svg?style=flat-square
[license-href]: https://npmjs.com/package/@luxdamore/nuxt-apis-to-file
