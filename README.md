# 🎉 Nuxt APIs to file

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Nuxt module to merge and transform API calls into a single file, like a `payload-extractor`.

## Motivation

If you have (like me), too much `dispatch` in you [nuxtServerInit](https://nuxtjs.org/guide/vuex-store/#the-nuxtserverinit-action) action, maybe you prefer to merge all of this requests into a single JSON file to **speed up**, **blazing fast** your *nuxt-website*!
This file is generated *during the build-process* and it's called only *once*.
In this way, your are also saving and protecting your data because you aren't exposing the `.json` file in the `static/` dir (you can change this behavior passing a different configuration to the module).

[Inspired by this comment](https://github.com/nuxt/nuxt.js/issues/123#issuecomment-272246782).

> You can use this module for every *static*, *shared* or *pre-loaded* data.

Usually, when you **call one or more API** 📞, you're slowing down your website because every single request need to *resolve the response* (with different [TTFB](https://web.dev/time-to-first-byte/)).

> Having 3/4 requests in the `nuxtServerInit` or in the `asyncData` can increase **up to a second** the TTFB of your website (causing **worse performance audits**).

With this module you (and your user) no longer have to wait for this anymore, because everything is resolved during the build-process.

___

## Setup

1. Add `@luxdamore/nuxt-apis-to-file` dependency to your project;
2. Add `@luxdamore/nuxt-apis-to-file` to the `buildModules` section of your `nuxt.config.js`;
3. Add the folder `apis-to-json/` to your `.gitignore` file.

```bash

    yarn add @luxdamore/nuxt-apis-to-file # or npm install --save @luxdamore/nuxt-apis-to-file

```

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
                    endpoint: 'https://awesome-api.com/give-me-my-blazing-fast-data', // default = `axios.url`
                    method: 'get', // default = `axios.method || 'get'`
                    // The params of the request, you can pass a graph-ql query too, check it in the example folder
                    body: {},
                    // Use this to map the response in a custom `key`
                    field: 'categories', // default = `the actual index in this array of requests`
                    // Usually, your data is always nested in one or more objects
                    pathToData: 'data.categories.listCategories',
                    // In case of no-response, what value do you prefer for your empty data?
                    emptyValue: [],
                    // Like headers, authentication or everything is required by this request
                    config: {},
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
                'items/getItemsCategories',  // TTFB + ~200ms
            );
            await dispatch(
                'news/getNewsCategories',  // TTFB + ~250ms
            );

            // with apis-to-json
            await dispatch(
                'build-data/getDataFromFile',
            );

        },
    };

    // create a module to read the generated file
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
                itemsCategories,
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
- [Axios.create](https://github.com/axios/axios#creating-an-instance);
- [@nuxtjs/axios](https://axios.nuxtjs.org/).

## Development

1. Clone this repository;
2. Install dependencies using `yarn install` or `npm install`;
3. Start development server using `npm run dev`.

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

## 🐞 Issues

Please make sure to read the [Issue Reporting Checklist](/.github/ISSUE_TEMPLATE/bug_report.md) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## 👥 Contribution

Please make sure to read the [Contributing Guide](/.github/ISSUE_TEMPLATE/feature_request.md) before making a pull request.

## 📖 Changelog

Details changes for each release are documented in the [**release notes**](./CHANGELOG.md).

### 📃 License

[MIT License](./LICENSE) // Copyright (©) 2019-present [Luca Iaconelli](https://lucaiaconelli.it)

#### 💸 Are you feeling generous today?  :)

Do you want to share a beer? We can be good friends.. __[Paypal](https://www.paypal.me/luxdamore) // [Patreon](https://www.patreon.com/luxdamore)__

> _It's always a good day to be magnanimous - cit_

#### 💼 Hire me

[![Otechie](https://api.otechie.com/consultancy/luxdamore/badge.svg)](https://otechie.com/luxdamore)

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/luxdamore)

___

##### ✔ TODO

> Just asking myself if i should do more.

- Automatically transform .gql and .graphql files for the json-body?
- API calls should continue on error? (Instead of using a try-for i can use a for-try)
- Add a plugin or a template for the generated data?
- Automatically inject the data in context?
- Automatically inject it in the store?
