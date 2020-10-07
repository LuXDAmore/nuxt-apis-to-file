export const state = () => (
    {
        items: [],
        paginated: [],
    }
);

export const mutations = {
    SET_ITEMS(
        state,
        items,
    ) {

        state.items = items;

    },
    SET_ITEMS_PAGINATED(
        state,
        items,
    ) {

        state.paginated = items;

    },
};
