# Nuxt APIs to file

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Circle CI][circle-ci-src]][circle-ci-href]
[![Codecov][codecov-src]][codecov-href]
[![License][license-src]][license-href]

> Nuxt module to merge and transform API calls into a single file, like a `payload-extractor`.

___

## Setup

1. Add `@luxdamore/nuxt-apis-to-file` dependency to your project;
2. Add `@luxdamore/nuxt-apis-to-file` to the `buildModules` section of your `nuxt.config.js`, [DOCS](https://nuxtjs.org/guide/modules/#build-only-modules);
3. Add the folder `apis-to-json/` to your `.gitignore` file.

```bash

    yarn add @luxdamore/nuxt-apis-to-file # or npm install --save @luxdamore/nuxt-apis-to-file

```

```js

    // nuxt.config.js
    {

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
                // The `file.path` is always starting from the [srcDir](https://nuxtjs.org/api/configuration-srcdir/), but you can force it from the [`static/` dir](https://nuxtjs.org/api/configuration-dir/) changing this
                startFromStaticDir: false,
                // Options passed directly to [fs-extra.outputJson](https://github.com/jprichardson/node-fs-extra/blob/master/docs/outputJson.md)
                options: {},
            },
            // Hide console messages, default = `! this.options.dev`
            hideErrorsInConsole: false,
            hideGenericMessagesInConsole: false,
            // A sub-folder of -file.path- in which to place the file
            dir: null,
            // [@nuxtjs/axios](https://axios.nuxtjs.org/) are automatically injected, but you can override them here
            axios: {},
            // Your APIs to extract, **required**
            requests: [
                // Every request is an object passed to an axios-call, [created from the axios-config](https://github.com/axios/axios#creating-an-instance)
                {
                    // default = `options.axios.url`
                    endpoint: 'https://awesome-api.com/give-me-my-data',
                    // default = `options.axios.method || "get"`
                    method: 'get',
                    // The params of the request, you can pass a GraphQL query too, check it in the examples
                    body: {},
                    // In case of no-response the value of this request is an empty array
                    emptyValue: [],
                    // Like headers, authentication or something that is required only by this request, instead it gets the default axios config
                    config: {},
                    // Use this to map the response in a custom field of the file, default = `the actual index in this array of requests`
                    field: 'categories',
                    // Usually, your data is always inside an object, but maybe you need only some part of your response
                    pathToData: 'data.categories.listCategories',
                },

                /*

                    In this example the *response-object* is:
                    `response: {
                        data: {
                            categories: {
                                listCategories: [ DATA ],
                            },
                        },
                    }`,

                    but the extracted file is only the chosen *field* containing the *pathToData*:
                    `{
                        categories: [ DATA ]
                    }`

                */

            ],
        }

    }

```

## Motivation

If you have (like me), too much `dispatch` in you [nuxtServerInit](https://nuxtjs.org/guide/vuex-store/#the-nuxtserverinit-action) action, maybe you prefer to merge all of this calls into a single JSON file to **speed up**, **blazing fast** your *nuxt-website*!
This file is generated only *during the build-process* and it's called only *one time*.
In this way, your are also protecting your data because you're not exposing `data.json` in the `static/` dir (you can change this behavior passing a different configuration to the module).

[Inspired by this comment](https://github.com/nuxt/nuxt.js/issues/123#issuecomment-272246782).

```js

    // store/index.js
    export const actions = {
        async nuxtServerInit(
            { dispatch },
        ) {

            await dispatch(
                'build-data/getDataFromFile',
            );

        },
    };

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
                'categories/SET_CATEGORIES',
                itemsCategories,
                {
                    root: true,
                }
            );

            commit(
                'categories/SET_NEWS_CATEGORIES',
                itemsCategories,
                {
                    root: true,
                }
            );

        }
    };

```

___

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

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

## Issues

Please make sure to read the [Issue Reporting Checklist](/.github/ISSUE_TEMPLATE/bug_report.md) before opening an issue. Issues not conforming to the guidelines may be closed immediately.

## Contribution

Please make sure to read the [Contributing Guide](/.github/ISSUE_TEMPLATE/feature_request.md) before making a pull request.

## Changelog

Details changes for each release are documented in the [📖 **release notes**](./CHANGELOG.md).

### License

[MIT License](./LICENSE) // Copyright (©) 2019-present [Luca Iaconelli](https://lucaiaconelli.it)

#### Are you feeling generous today?  :)

Do you want to give me a beer? We can be good friends..
__[Paypal](https://www.paypal.me/luxdamore) // [Patreon](https://www.patreon.com/luxdamore)__

> _It's always a good day to be magnanimous - cit_

#### Hire me

[![Otechie](https://api.otechie.com/consultancy/luca-iaconelli/badge.svg)](https://otechie.com/luca-iaconelli)

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/luxdamore)

___

##### TODO

- Need tests;
- Need examples: GraphQL.
