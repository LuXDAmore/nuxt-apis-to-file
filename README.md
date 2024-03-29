# 🎉 Nuxt APIs to file

[![Code Quality][quality-src]][quality-href]
[![Dependencies][dependencies-src]][dependencies-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![npm version][npm-version-src]][npm-version-href]
[![Donate][paypal-donate-src]][paypal-donate-href]

[quality-src]: https://img.shields.io/badge/code%20quality-A-informational?style=flat
[quality-href]: https://luxdamore.github.io/nuxt-apis-to-file/

[dependencies-src]: https://img.shields.io/badge/dependencies-up%20to%20date-darkgreen.svg?style=flat
[dependencies-href]: https://npmjs.com/package/@luxdamore/nuxt-apis-to-file

[circle-ci-src]: https://img.shields.io/circleci/project/github/LuXDAmore/nuxt-apis-to-file.svg?style=flat&color=darkgreen
[circle-ci-href]: https://circleci.com/gh/LuXDAmore/nuxt-apis-to-file

[npm-downloads-src]: https://img.shields.io/npm/dt/@luxdamore/nuxt-apis-to-file.svg?style=flat&color=orange
[npm-downloads-href]: https://npmjs.com/package/@luxdamore/nuxt-apis-to-file

[npm-version-src]: https://img.shields.io/npm/v/@luxdamore/nuxt-apis-to-file/latest.svg?style=flat&color=orange
[npm-version-href]: https://npmjs.com/package/@luxdamore/nuxt-apis-to-file

[paypal-donate-src]: https://img.shields.io/badge/paypal-donate-black.svg?style=flat
[paypal-donate-href]: https://www.paypal.me/luxdamore

> Nuxt module to merge and transform multiple API + GraphQL requests into a single one, during build-time, like a `payload extractor`.

## 💘 Motivation

If you have (like me), too much `dispatch` in you [nuxtServerInit](https://nuxtjs.org/guide/vuex-store/#the-nuxtserverinit-action) action, maybe you prefer to merge all of this requests into a single JSON file to **speed up**, **blazing fast** your *nuxt-website*!
This file is generated *during the build-process* and it's called only *once*.
In this way, your are also saving and protecting your data because you aren't exposing the `.json` file in the `static/` dir (you can change this behavior passing a different configuration to the module).

Usually, when you **call one or more API** 📞, you're slowing down your website because every single request need to *resolve the response* (with different [TTFB](https://web.dev/time-to-first-byte/)).

> Having 3/4 requests in the `nuxtServerInit` or in the `asyncData` can increase **up to a second** the TTFB of your website (causing **worse performance audits**).

With this module you (and your users) no longer have to wait for this anymore, because everything is resolved during the build-process.

> You can use this module for every *static*, *shared* or *pre-loaded* data.

[Inspired by this comment](https://github.com/nuxt/nuxt.js/issues/123#issuecomment-272246782).

___

## Setup

1. Add `@luxdamore/nuxt-apis-to-file` dependency to your project;
2. Add `@luxdamore/nuxt-apis-to-file` to the `buildModules` section of your `nuxt.config.js`;
3. Add the folder `apis-to-json/` to your `.gitignore` file.

```bash

    yarn add @luxdamore/nuxt-apis-to-file # or npm install --save @luxdamore/nuxt-apis-to-file

```

## Configuration

**_N.B. : Shallow merge, not deep merge._**

```js

    // nuxt.config.js
    export default {

        // Module installation
        modules: [ '@luxdamore/nuxt-apis-to-file' ], // nuxt < v2.9
        buildModules: [ '@luxdamore/nuxt-apis-to-file' ], // nuxt >= v2.9

        // Module config
        apisToFile: {
            file: {
                // The name of the file
                name: 'data',
                // The extension of the file
                ext: 'json',
                // The main folder where to save the generated file, you should add this path to your `.gitignore` file
                path: 'apis-to-file',
                // The `file.path` is always starting from the `srcDir`, but you can force it to the `static/` dir changing this
                startFromStaticDir: false,
                // Options passed directly to the `outputJson` method of the `fs-extra` library
                options: {},
            },
            // Hide console messages
            hideErrorsInConsole: false,
            hideGenericMessagesInConsole: false, // default = `! nuxtConfig.dev`
            // A sub-folder of `file.path` in which to place the file
            dir: null,
            // `@nuxtjs/axios` config is automatically injected, but you can override it here
            axios: {},
            // Your APIs to extract
            requests: [
                // Every request is passed to an `axios.create` instance
                {
                    skip: false, // skip a request
                    endpoint: 'https://awesome-api.com/give-me-my-blazing-fast-data', // default = `axios.url`
                    method: 'get', // default = `axios.method || 'get'`
                    // The params of the request, you can pass a graph-ql query too, check it in the example folder
                    body: {},
                    // Use this to map the response in a custom `key`
                    field: 'categories', // default = `the actual index in this array of requests`
                    // Usually, your data is always nested in one or more objects
                    pathToData: 'data.categories.listCategories.items', // Check `dot-object` to know more
                    // In case of no-response, what value do you prefer for your empty data?
                    emptyValue: [],
                    // Like headers, authentication or everything is required by this request
                    config: {},
                    // New, available with version >= 1.2
                    id: -1, // useful for debugging purpose, default = `the actual index in this array of requests + 1`
                    // For RECURSIVE api request with lists or nested data, N.B. : RECURSIVE, keep attention
                    pagination: {
                        pathBodyToPaginationParamValue: 'variables.nextToken', // [REQUIRED], witch params should update to match the next page? It depends on how you manage the pagination from the BE
                        pathResponseToTheNextPaginationValue: 'data.categories.listCategories.nextToken', // useful with Graphql, default = null
                        step: 1, // It always start with the `pathBodyToPaginationParamValue` param if specified, so this is used to increase this numeric value
                        maxIterations: 15, // Max iterations
                        lastPaginationValue: null // useful with Graphql, stop the next Iteration if 'pathResponseToTheNextPaginationValue' or 'pathBodyToPaginationParamValue' match this value
                    },
                },
            ],
        },

    };

```

```bash

    # In this example the *response* is:
    `response: {
        data: {
            categories: {
                listCategories: [ DATA ],
            },
        },
    }`,

    # but the extracted file is only containing the chosen *pathToData* in the *field* key:
    `{ categories: [ DATA ] }`

```

### Usage

```js

    // store/index.js
    export const actions = {
        async nuxtServerInit(
            { dispatch },
        ) {

            // usual old-slowly-way
            await dispatch(
                'items/getItemsCategories',  // TTFB + ~200ms 😨
            );
            await dispatch(
                'news/getNewsCategories',  // TTFB + ~250ms 😱
            );

            // with the-fastest-new-way of apis-to-json
            await dispatch(
                'build-data/getDataFromFile', // TTFB .. Guess 🤭
            );

        },
    };

    // Create a module to load the generated file
    // store/build-data.js
    const getFile = () => import(
        '~/apis-to-file/data.json'
    ).then(
        m => m.default || m
    );

    export const actions = {
        async getDataFromFile(
            { commit }
        ) {

            let itemsCategories = []
                , newsCategories = []
            ;

            try {

                const { categories, otherCategories } = await getFile();

                if( categories )
                    itemsCategories = categories;

                if( otherCategories )
                    newsCategories = otherCategories;

            } catch( e ) {

                console.error(
                    {
                        e,
                    }
                );

            }

            commit(
                'items/SET_ITEMS_CATEGORIES',
                itemsCategories,
                {
                    root: true,
                }
            );

            commit(
                'news/SET_NEWS_CATEGORIES',
                newsCategories,
                {
                    root: true,
                }
            );

        }
    };

```

___

### Related things you should know

- Nuxt [srcDir](https://nuxtjs.org/api/configuration-srcdir/);
- Nuxt [staticDir](https://nuxtjs.org/api/configuration-dir/);
- Nuxt [buildModules](https://nuxtjs.org/guide/modules/#build-only-modules);
- [fs-extra.outputJson](https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md);
- `pathTo` data handled with [dot-notation](https://github.com/rhalff/dot-object);
- [Axios.create](https://github.com/axios/axios#creating-an-instance);
- [@nuxtjs/axios](https://axios.nuxtjs.org/).

## Development

1. Clone this repository;
2. Install dependencies using `yarn install` or `npm install`;
3. Start development server using `npm run dev`.

## 🐞 Issues

Please make sure to read the [Issue Reporting Checklist](/.github/ISSUE_TEMPLATE/bug_report.md) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## 👥 Contribution

Please make sure to read the [Contributing Guide](/.github/ISSUE_TEMPLATE/feature_request.md) before making a pull request.

## 📖 Changelog

Details changes for each release are documented in the [**release notes**](./CHANGELOG.md).

### 📃 License

[MIT License](./LICENSE) // Copyright (©) 2019-present [Luca Iaconelli](https://lucaiaconelli.it)

#### 💼 Hire me

[![Contacts](https://img.shields.io/badge/Contact%20Me-Let's%20Talk-informational?style=social&logo=minutemailer)](https://lucaiaconelli.it)

#### 💸 Are you feeling generous today?

If You want to share a beer, we can be really good friends

__[Paypal][paypal-donate-href] // [Patreon](https://www.patreon.com/luxdamore) // [Ko-fi](https://ko-fi.com/luxdamore)__

> ☀ _It's always a good day to be magnanimous_ - cit.
