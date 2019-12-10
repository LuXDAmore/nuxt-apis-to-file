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
            startFromStaticDir: false,
            options: {},
        },
        hideErrorsInConsole: false,
        hideGenericMessagesInConsole: false,
        dir: null,
        requests: [],
        axios: {},
    }
    , checkIfUndefinedAndReturnDifferentData = (
        check,
        value,
    ) => {

        return typeof check === 'undefined'
            ? value
            : check
        ;

    }
;

export default async function(
    moduleOptions,
) {

    const options = {
        ... defaultConfig,
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
            'skipping, no requests found in the configuration',
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
            )
            , errors = []
        ;

        fileContent = responses.reduce(
            (
                accumulator,
                { data = {} },
                index,
            ) => {

                data.error && errors.push(
                    data.error
                );

                data.errors && data.errors.length && errors.push(
                    ... data.errors.map(
                        error => error.message || 'Generic error',
                    ),
                );

                const {
                        field: key = index,
                        emptyValue = [],
                        pathToData,
                    } = requests[ index ]
                    , value = (
                        pathToData
                            ? pathToData
                                .split(
                                    '.',
                                )
                                .reduce(
                                    (
                                        acc,
                                        key,
                                    ) => (
                                        typeof acc !== 'undefined' && acc !== null
                                            ? checkIfUndefinedAndReturnDifferentData(
                                                acc[ key ],
                                                emptyValue
                                            )
                                            : acc || {}
                                    ),
                                    data || {},
                                )
                            : checkIfUndefinedAndReturnDifferentData(
                                data,
                                emptyValue
                            )
                    )
                ;

                return {
                    ... accumulator,
                    [ key ]: value,
                };

            },
            {},
        );

        // Console
        errors.length && ! options.hideErrorsInConsole && logger.error(
            '\x1B[31m%s\x1B[0m',
            moduleName,
            'error during request',
            errors
        );

        ! options.hideGenericMessagesInConsole && logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'total number of APIs calls',
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
        `${ options.file.startFromStaticDir ? this.options.dir.static : this.options.srcDir }/${ options.file.path }/${ options.dir || '' }/${ options.file.name }.${ options.file.ext }`,
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
