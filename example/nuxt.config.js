import { resolve } from 'path';
import * as PACKAGE from '../package.json';

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
    srcDir: __dirname,
    head: {
        htmlAttrs: {
            lang: 'en',
        },
        title: PACKAGE.name,
        meta,
    },
    render: {
        resourceHints: false,
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
};
