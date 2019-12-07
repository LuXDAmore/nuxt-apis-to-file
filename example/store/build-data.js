const getFile = () => import(
    '~/apis-to-file/data.json'
).then(
    m => m.default || m
);

// Actions
export const actions = {
    async getDataFromFile(
        { commit }
    ) {

        let preloadedComments = []
            , preloadedPosts = []
            , preloadedUsers = []
        ;

        try {

            const {
                comments,
                posts,
                users,
            } = await getFile();

            if( comments )
                preloadedComments = comments;
            if( posts )
                preloadedPosts = posts;
            if( users )
                preloadedUsers = users;

        } catch( e ) {

            console.error(
                {
                    e,
                }
            );

        }

        commit(
            'comments/SET_ITEMS',
            preloadedComments,
            {
                root: true,
            }
        );

        commit(
            'posts/SET_ITEMS',
            preloadedPosts,
            {
                root: true,
            }
        );

        commit(
            'users/SET_ITEMS',
            preloadedUsers,
            {
                root: true,
            }
        );

    },
};
