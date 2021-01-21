// Common
import { resolve } from 'path';
import * as PACKAGE from '../package.json';

// GraphQL RAW Queries
import {
    GRAPHQL,
    LOCATIONS,
} from './graphql';

// Configuration
const apisToFile = {
    axios: {
        baseURL: 'https://jsonplaceholder.typicode.com',
    },
    requests: [
        // Rest API
        {
            endpoint: '/posts',
            field: 'posts',
            body: {
                params: {
                    '_page': 1,
                    '_limit': 10,
                },
            },
        },
        {
            endpoint: '/posts',
            field: 'postsPaginated',
            body: {
                params: {
                    '_page': 1,
                    '_limit': 10,
                },
            },
            // New settings
            pagination: {
                pathBodyToPaginationParamValue: 'params._page',
                maxIterations: 3,
            },
        },
        {
            endpoint: '/comments',
            field: 'comments',
            body: {
                params: {
                    '_limit': 10,
                },
            },
        },
        {
            endpoint: '/comments',
            field: 'commentsPaginated',
            body: {
                params: {
                    '_page': 1,
                    '_limit': 15,
                },
            },
            // New settings
            pagination: {
                pathBodyToPaginationParamValue: 'params._page',
                step: 2,
                lastPaginationValue: 7,
            },
        },
        // GraphQL
        {
            endpoint: 'https://countries.trevorblades.com/',
            method: 'post',
            field: 'graphql',
            pathToData: 'data.country',
            emptyValue: {},
            body: GRAPHQL,
        },
        {
            endpoint: 'https://kdonz3bavvbbhmocoletnw4w2q.appsync-api.eu-west-1.amazonaws.com/graphql',
            method: 'post',
            field: 'graphqlLocations',
            pathToData: 'data.listLocations',
            config: {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'da2-jy2nym3ybbgubehdqhf5rjgbxq',
                    'x-region': 'eu-west-1',
                },
            },
            emptyValue: {},
            body: LOCATIONS,
        },
        {
            endpoint: 'https://kdonz3bavvbbhmocoletnw4w2q.appsync-api.eu-west-1.amazonaws.com/graphql',
            method: 'post',
            field: 'graphqlLocationsPaginated',
            pathToData: 'data.listLocations.items',
            config: {
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': 'da2-jy2nym3ybbgubehdqhf5rjgbxq',
                    'x-region': 'eu-west-1',
                },
            },
            body: LOCATIONS,
            // New settings
            pagination: {
                pathResponseToTheNextPaginationValue: 'data.listLocations.nextToken',
                pathBodyToPaginationParamValue: 'variables.nextToken',
            },
        },
    ],
};

// NuxtJs
export default {
    // Plugin options
    apisToFile,
    // Options
    target: 'static',
    modern: true,
    srcDir: __dirname,
    rootDir: resolve(
        __dirname,
        '..',
    ),
    buildDir: resolve(
        __dirname,
        '.nuxt',
    ),
    buildModules: [
        resolve(
            __dirname,
            '../lib/module'
        ),
    ],
    watch: [
        resolve(
            __dirname,
            '../lib/module'
        ),
    ],
    // Meta
    head: {
        htmlAttrs: {
            lang: 'en',
        },
        title: PACKAGE.name,
        link: [
            {
                once: true,
                hid: 'favicon',
                rel: 'shortcut icon',
                type: 'image/x-icon',
                href: '/favicon.ico',
            },
            {
                once: true,
                hid: 'humans',
                rel: 'author',
                type: 'text/plain',
                href: '/humans.txt',
            },
        ],
        meta: [
            {
                once: true,
                hid: 'description',
                name: 'description',
                content: PACKAGE.description,
            },
            {
                once: true,
                hid: 'keywords',
                name: 'keywords',
                content: PACKAGE.keywords.join(
                    ','
                ),
            },
        ],
    },
    /*
     * Router
     */
    router: {
        base: (
            process.env.NODE_ENV === 'production'
            ? '/nuxt-apis-to-file/'
            : '/'
        ),
    },
    /*
     * Generate
     */
    generate: {
        dir: resolve(
            __dirname,
            '../docs'
        ),
    },
    /*
    * Build
    */
    build: {
        loaders: {
            vue: {
                compilerOptions: {
                    preserveWhitespace: false,
                    whitespace: 'condense',
                },
            },
        },
        /*
         ** Minifier
         */
         html: {
            minify: {
                collapseBooleanAttributes: true,
                decodeEntities: true,
                minifyCSS: true,
                minifyJS: true,
                processConditionalComments: true,
                collapseInlineTagWhitespace: true,
                removeOptionalTags: true,
                removeAttributeQuotes: true,
                removeEmptyAttributes: true,
                removeRedundantAttributes: true,
                trimCustomFragments: true,
                useShortDoctype: true,
                collapseWhitespace: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                removeComments: true,
                continueOnParseError: true,
            },
        },
        /*
         ** Run lint on save
         */
         extend(
            config,
            {
                isDev,
                isClient,
            },
        ) {

            /*
             ** ESLint loaded
             */
            isDev && isClient && config.module.rules.push(
                {
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/,
                },
            );

        },
    },
    /*
     * Server
     */
    server: {
        host: '0.0.0.0',
    },
};
