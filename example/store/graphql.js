export const state = () => (
    {
        data: {},
    }
);

export const mutations = {
    SET_ITEMS(
        state,
        value,
    ) {

        state.data = value;

    },
};
