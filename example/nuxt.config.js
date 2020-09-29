// Common
import { resolve } from 'path';
import * as PACKAGE from '../package.json';

// GraphQL RAW Queries
import { GRAPHQL, LOCATIONS } from './graphql';

// Configuration
const apisToFile = {
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
        {
            endpoint: 'https://kdonz3bavvbbhmocoletnw4w2q.appsync-api.eu-west-1.amazonaws.com/graphql',
            method: 'post',
            field: 'locations',
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
            // New settings
        },
    ],
};

// NuxtJs
export default {
    // Plugin options
    apisToFile,
    // Other options
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
    head: {
        htmlAttrs: {
            lang: 'en',
        },
        title: PACKAGE.name,
        meta: [
            {
                once: true,
                hid: 'description',
                name: 'description',
                content: PACKAGE.description,
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
     * Server
     */
    server: {
        host: '0.0.0.0',
    },
};
