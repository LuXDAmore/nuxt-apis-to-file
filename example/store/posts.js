export const state = () => (
    {
        items: [],
    }
);

export const mutations = {
    SET_ITEMS(
        state,
        items,
    ) {

        state.items = items;

    },
};
