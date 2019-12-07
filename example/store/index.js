export const actions = {
    async nuxtServerInit(
        { dispatch },
    ) {

        await dispatch(
            'build-data/getDataFromFile',
        );

    },
};
