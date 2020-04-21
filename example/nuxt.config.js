import { resolve } from 'path';
import * as PACKAGE from '../package.json';

import { USERS } from './graphql';

const meta = [
    {
        once: true,
        hid: 'description',
        name: 'description',
        content: PACKAGE.description,
    },
];

export default {
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
                endpoint: 'https://api.graph.cool/simple/v1/ciyz901en4j590185wkmexyex',
                method: 'post',
                field: 'users',
                pathToData: 'data.allUsers',
                body: USERS,
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
