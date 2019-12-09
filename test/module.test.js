import { Nuxt, Builder } from 'nuxt';
import { JSDOM } from 'jsdom';
import request from 'request-promise-native';
import getPort from 'get-port';
import config from '../example/nuxt.config';

config.dev = false;

jest.setTimeout(
    60000
);

let nuxt
    , port
;

const url = path => `http://localhost:${ port }${ path }`
    , get = path => request(
        url(
            path
        )
    )
;

describe(
    'nuxt',
    () => {

        beforeAll(
            async() => {

                nuxt = new Nuxt(
                    config
                );

                await nuxt.ready();

                await new Builder(
                    nuxt
                ).build();

                port = await getPort();

                await nuxt.listen(
                    port
                );

            }
        );

        afterAll(
            async() => {

                await nuxt.close();

            }
        );

        test(
            'render',
            async() => {

                const html = await get(
                    '/'
                );

                expect(
                    html
                ).toContain(
                    'NUXT Apis to file'
                );

            }
        );

        describe(
            'data',
            () => {

                const getElement = async(
                    selector,
                    value
                ) => {

                    const html = await get(
                            '/'
                        )
                        , { window } = new JSDOM(
                            html
                        ).window
                        , element = window.document.querySelector(
                            selector
                        )
                        , number = element.querySelector(
                            '.number'
                        )
                        , numberValue = number.textContent
                    ;

                    expect(
                        element
                    ).toBeDefined();

                    expect(
                        number
                    ).toBeDefined();

                    expect(
                        numberValue
                    ).toBeDefined();

                    expect(
                        parseInt(
                            numberValue
                        )
                    ).toEqual(
                        value
                    );

                };

                test(
                    'comments',
                    async() => {

                        await getElement(
                            '.comments',
                            500,
                        );

                    }
                );

                test(
                    'comments',
                    async() => {

                        await getElement(
                            '.posts',
                            100,
                        );

                    }
                );

                test(
                    'users',
                    async() => {

                        await getElement(
                            '.users',
                            10,
                        );

                    }
                );

            }
        );

    }
);
