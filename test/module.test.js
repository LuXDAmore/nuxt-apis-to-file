// Test utils
import {
    setup,
    get,
} from '@nuxtjs/module-test-utils';

// Dom
import { JSDOM } from 'jsdom';

// Nuxt config
import config from '../example/nuxt.config';

const BASE_URL = '/';

config.dev = false;
config.router.base = BASE_URL;

// Tests
describe(
    'module',
    () => {

        let nuxt;

        beforeAll(
            async() => {

                (
                    { nuxt } = (
                        await setup(
                            config
                        )
                    )
                );

            },
            90000
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
                    BASE_URL
                );

                expect(
                    html
                ).toContain(
                    'Apis to file'
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
                            BASE_URL
                        )
                        , { window } = new JSDOM(
                            html
                        )
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
                    'posts',
                    async() => {

                        await getElement(
                            '.posts',
                            100,
                        );

                    }
                );

                test(
                    'graphql',
                    async() => {

                        const html = await get(
                            BASE_URL
                        );

                        expect(
                            html
                        ).toContain(
                            'Italy'
                        );

                    }
                );

            }
        );

    }
);
