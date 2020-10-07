export const state = () => (
    {
        data: {},
        paginated: [],
    }
);

export const mutations = {
    SET_ITEMS(
        state,
        value,
    ) {

        state.data = value;

    },
    SET_ITEMS_PAGINATED(
        state,
        items,
    ) {

        state.paginated = items;

    },
};
