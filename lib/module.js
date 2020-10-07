// Node
import { resolve } from 'path';

// External
import { create, all } from 'axios';
import { str, pick } from 'dot-object';
import { outputJson } from 'fs-extra';

// Log
import * as PACKAGE from '../package.json';
import log from './logger';

// Module
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
        // New
        genericErrorMessage: 'Generic error',
        pagination: null,
    }
;

// Find the data
function findValue(
    pathway,
    data = {},
    emptyValue = [],
) {

    if( ! pathway ) {

        if( typeof data !== 'undefined' && data !== null )
            return data;

        return emptyValue;

    }

    try {

        const value = pick(
            pathway,
            data
        );

        if( typeof value !== 'undefined' && value !== null )
            return value;

    } catch( e ) {

        logger.error(
            '\x1B[31m%s\x1B[0m',
            moduleName,
            '[dot-object] error',
            e
        );

    }

    return emptyValue;

}

export default async function(
    moduleOptions,
) {

    // Default options
    const options = {
        ... defaultConfig,
        hideGenericMessagesInConsole: ! this.options.dev,
        axios: this.options.axios || {},
        ... moduleOptions || {},
        ... this.options[ moduleName ] || {},
        ... this.options.apisToFile || {},
    };

    // Check for requests
    if( ! options.requests || ! options.requests.length ) {

        logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'skipping, no requests found in the configuration object',
        );

        return;

    }

    // Promises generator
    const axiosWithConfig = create(
            options.axios,
        )
        // Requests filtering
        , validRequests = options.requests.filter(
            obj => ! obj.skip,
        )
        , {
            requestsInParallel,
            requestsWithPagination,
        } = validRequests.reduce(
            (
                accumulator,
                item,
                index
            ) => {

                if( ! item.id )
                    item.id = index + 1;

                if( item.pagination && item.pagination.pathBodyToPaginationParamValue ) {

                    accumulator.requestsWithPagination.push(
                        item
                    );

                } else {

                    accumulator.requestsInParallel.push(
                        item
                    );

                }

                return accumulator;

            },
            {
                requestsInParallel: [],
                requestsWithPagination: [],
            }
        )
        , errors = []
    ;

    let fileContent = {};

    // Parallel requests
    if( requestsInParallel.length ) {

        // Handle results
        const promises = [];

        // Parallel promises generation
        for( let index = 0; index < requestsInParallel.length; index ++ ) {

            const request = requestsInParallel[ index ]
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

        // API
        try {

            const responses = await all(
                promises,
            );

            // Start the file creation
            fileContent = responses.reduce(
                (
                    accumulator,
                    { data = {} },
                    index,
                ) => {

                    const {
                            id,
                            field: key = index,
                            emptyValue,
                            pathToData,
                        } = requestsInParallel[ index ]
                        , value = findValue(
                            pathToData,
                            data,
                            emptyValue
                        )
                    ;

                    // Keep errors for later
                    data.error && errors.push(
                        `[${ id }] ${ data.error }`
                    );

                    data.errors && data.errors.length && errors.push(
                        ... data.errors.map(
                            error => `[${ id }] ${ error.message }`
                        ),
                    );

                    // Return data
                    return {
                        ... accumulator,
                        [ key ]: value,
                    };

                },
                {},
            );

        } finally {} // eslint-disable-line

    }

    // Recursive requests
    if( requestsWithPagination.length ) {

        // Pagination
        for( let index = 0; index < requestsWithPagination.length; index ++ ) {

            const request = requestsWithPagination[ index ]
                , {
                    method = options.axios.method || 'get',
                    endpoint = options.axios.url,
                    body = {},
                    config = {},
                    // Paths
                    id,
                    field: key = index,
                    emptyValue = [],
                    pathToData,
                    // Pagination
                    pagination: {
                        pathBodyToPaginationParamValue,
                        pathResponseToTheNextPaginationValue = null,
                        step = 1,
                        maxIterations = 15,
                        lastPaginationValue = null,
                    },
                } = request
                // Recursive data
                , recursion = async() => {

                    // Value and limit control
                    let value = emptyValue
                        , count = 1
                        // Params
                        , params = body
                    ;

                    async function next(
                        token
                    ) {

                        if( token ) {

                            params = str(
                                pathBodyToPaginationParamValue,
                                token,
                                params
                            );

                        }

                        try {

                                const { data = {} } = await axiosWithConfig[ method ](
                                    endpoint,
                                    params,
                                    config,
                                )
                                , newValue = findValue(
                                    pathToData,
                                    data,
                                    emptyValue,
                                )
                            ;

                            if( value && newValue ) {

                                if(
                                    Array.isArray(
                                        value
                                    )
                                ) {

                                    value.push(
                                        ... newValue
                                    );

                                } else {

                                    value = {
                                        ... value,
                                        ... newValue,
                                    };

                                }

                            }

                            // Keep errors for later
                            data.error && errors.push(
                                `[${ id }] ${ data.error }`
                            );

                            data.errors && data.errors.length && errors.push(
                                ... data.errors.map(
                                    error => `[${ id }] ${ error.message }`
                                ),
                            );

                        } finally {} // eslint-disable-line

                        // Check for NEXT pagination value
                        const nextToken = (
                                pathResponseToTheNextPaginationValue
                                    ? findValue(
                                        pathResponseToTheNextPaginationValue,
                                        data,
                                        null
                                    )
                                    : (
                                        parseInt(
                                            findValue(
                                                pathBodyToPaginationParamValue,
                                                params,
                                                step
                                            ),
                                            10
                                        ) + step
                                    )
                            )
                        ;

                        if( ! nextToken || nextToken === lastPaginationValue || maxIterations <= count )
                            return value;

                        count ++;

                        await next(
                            nextToken
                        );

                    }

                    await next();

                    return value;

                }
                // Do it
                , data = await recursion()
            ;

            fileContent[ key ] = data;

        }

    }

    // Console
    if( ! options.hideGenericMessagesInConsole ) {

        logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'total number of Parallel APIs requests',
            requestsInParallel.length,
        );

        logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'total number of Parallel APIs requests',
            requestsWithPagination.length,
        );

        logger.info(
            '\x1B[32m%s\x1B[0m',
            moduleName,
            'total number of APIs requests',
            validRequests.length,
        );

    }

    if( ! options.hideErrorsInConsole && errors.length ) {

        logger.error(
            '\x1B[31m%s\x1B[0m',
            moduleName,
            'total number of errors',
            errors.length
        );

        logger.error(
            '\x1B[31m%s\x1B[0m',
            moduleName,
            'recorded errors',
            errors
        );

    }

    // File data
    const completeFilePath = resolve(
        __dirname,
        `${ options.file.startFromStaticDir ? this.options.dir.static : this.options.srcDir }/${ options.file.path || '' }/${ options.dir || '' }/${ options.file.name || moduleName }.${ options.file.ext || 'json' }`,
    );

    // File generation
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

// Exports
const meta = PACKAGE;

export { meta };
