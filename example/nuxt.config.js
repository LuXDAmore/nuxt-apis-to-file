import { resolve } from 'path';
import * as PACKAGE from '../package.json';

import { GRAPHQL } from './graphql';

const meta = [
    {
        once: true,
        hid: 'description',
        name: 'description',
        content: PACKAGE.description,
    },
];

export default {
    modern: true,
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
    apisToFile: {
        axios: {
            baseURL: 'https://jsonplaceholder.typicode.com',
        },
        requests: [
            {
                endpoint: '/posts',
                field: 'posts',
            },
            {
                endpoint: '/comments',
                field: 'comments',
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
        ],
    },
    srcDir: __dirname,
    head: {
        htmlAttrs: {
            lang: 'en',
        },
        title: PACKAGE.name,
        meta,
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
     * Server
     */
    server: {
        host: '0.0.0.0',
    },
};
