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

        // Utils
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

        // Rest API
        describe(
            'rest-api',
            () => {

                // Posts and comments
                test(
                    'posts',
                    async() => {

                        await getElement(
                            '.posts',
                            10,
                        );

                    }
                );

                test(
                    'comments',
                    async() => {

                        await getElement(
                            '.comments',
                            10,
                        );

                    }
                );

                // paginated
                describe(
                    'paginated',
                    () => {

                        test(
                            'posts',
                            async() => {

                                await getElement(
                                    '.posts-paginated',
                                    30,
                                );

                            }
                        );

                        test(
                            'comments',
                            async() => {

                                await getElement(
                                    '.comments-paginated',
                                    45,
                                );

                            }
                        );

                    }
                );

            }
        );

        // GraphQL
        describe(
            'graphql',
            () => {

                test(
                    'render',
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

                test(
                    'locations',
                    async() => {

                        await getElement(
                            '.locations',
                            9,
                        );

                    }
                );

                describe(
                    'paginated',
                    () => {

                        test(
                            'locations',
                            async() => {

                                await getElement(
                                    '.locations-paginated',
                                    20,
                                );

                            }
                        );

                    }
                );

            }
        );

    }
);
