import { Nuxt, Builder } from 'nuxt';
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
    'basic',
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
                    'Works!'
                );

            }
        );

    }
);
