import { resolve } from 'path';
import { create, all } from 'axios';
import { outputJson } from 'fs-extra';

import * as PACKAGE from '../package.json';

import log from './logger';

const moduleName = 'apis-to-file'
    , logger = log(
        `nuxt:${ moduleName }`,
    )
    , defaultConfig = {
        file: {
            name: 'data',
            ext: 'json',
            path: moduleName,
            options: {},
        },
        hideErrorsInConsole: false,
        hideGenericMessagesInConsole: false,
        dir: null,
        requests: [],
        axios: {},
    }
;

// [GitHub](https://github.com/nuxt/nuxt.js/issues/123#issuecomment-272246782)
// Gitignore

export default async function(
    moduleOptions,
) {

    const options = {
        ... defaultConfig,
        hideErrorsInConsole: ! this.options.dev,
        hideGenericMessagesInConsole: ! this.options.dev,
        axios: this.options.axios || {},
        ... moduleOptions || {},
        ... this.options[ moduleName ] || {},
        ... this.options.apisToFile || {},
    };

    if( ! options.requests || ! options.requests.length ) {

        ! options.hideErrorsInConsole && logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'skipping, no requests found in `nuxt.config.js`',
            {
                requestsToJson: {
                    requests: [{}],
                },
            },
        );

        return;

    }

    // Promise generator
    const axiosWithConfig = create(
            options.axios,
        )
        , requests = options.requests.filter(
            obj => ! obj.skip,
        )
        , promises = []
    ;

    for( let index = 0; index < requests.length; index ++ ) {

        const request = requests[ index ]
            , {
                method = options.axios.method || 'get',
                endpoint = options.axios.url,
                body = {},
                config = {},
            } = request
        ;

        promises.push(
            axiosWithConfig[ method ](
                endpoint,
                body,
                config,
            ),
        );

    }

    let fileContent = null;

    try {

        const responses = await all(
            promises,
        );

        fileContent = responses.reduce(
            (
                accumulator,
                { data = {} },
                index,
            ) => {

                ! options.hideErrorsInConsole && data.errors && data.errors.length && logger.error(
                    '\x1B[31m%s\x1B[0m',
                    moduleName,
                    'error during request',
                    ... data.errors.map(
                        error => error.message || 'Generic error',
                    ),
                );

                const request = requests[ index ]
                    , key = request.field || index
                    , emptyValue = typeof request.emptyValue !== 'undefined' ? request.emptyValue : []
                    , value = (
                        request.pathToData
                            ? request.pathToData
                                .split(
                                    '.',
                                )
                                .reduce(
                                    (
                                        acc,
                                        key,
                                    ) => (
                                        typeof acc !== 'undefined' && acc !== null
                                            ? acc[ key ] || emptyValue
                                            : acc || {}
                                    ),
                                    data || {},
                                )
                            : data || emptyValue
                    )
                    ;

                return {
                    ... accumulator,
                    [ key ]: value,
                };

            },
            {},
        );

        ! options.hideGenericMessagesInConsole && logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'number of APIs calls',
            responses.length,
        );

    } catch( e ) {

        ! options.hideErrorsInConsole && logger.error(
            '\x1B[31m%s\x1B[0m',
            moduleName,
            'there was a problem calling some APIs',
            e,
        );

    }

    // File generator
    const completeFilePath = resolve(
        __dirname,
        `${ this.options.srcDir }/${ options.file.path }/${ options.dir || '' }/${ options.file.name }.${ options.file.ext }`,
    );

    try {

        await outputJson(
            completeFilePath,
            fileContent || {},
            options.file.options || {},
        );

        ! options.hideGenericMessagesInConsole && logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'file correctly generated',
            completeFilePath,
        );

    } catch( e ) {

        ! options.hideErrorsInConsole && logger.error(
            '\x1B[31m%s\x1B[0m',
            moduleName,
            'there was a problem writing the json-file',
            e,
        );

    }

}

const meta = PACKAGE;

export { meta };
