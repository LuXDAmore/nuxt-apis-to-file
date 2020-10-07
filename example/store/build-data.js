// Import the generated data
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

        let preloadedPosts = []
            , preloadedCommentsPaginated = []
            , preloadedComments = []
            , preloadedPostsPaginated = []
            , preloadedGraphQl = {}
            , preloadedLocations = {}
            , preloadedLocationsPaginated = []
        ;

        try {

            const {
                posts,
                postsPaginated,
                comments,
                commentsPaginated,
                graphql,
                graphqlLocations,
                graphqlLocationsPaginated,
            } = await getFile();

            if( posts )
                preloadedPosts = posts;
            if( postsPaginated )
                preloadedPostsPaginated = postsPaginated;
            if( comments )
                preloadedComments = comments;
            if( commentsPaginated )
                preloadedCommentsPaginated = commentsPaginated;

            if( graphql )
                preloadedGraphQl = graphql;
            if( graphqlLocations )
                preloadedLocations = graphqlLocations;
            if( graphqlLocationsPaginated )
                preloadedLocationsPaginated = graphqlLocationsPaginated;

        } catch( e ) {

            console.error(
                {
                    e,
                }
            );

        }


        commit(
            'posts/SET_ITEMS',
            preloadedPosts,
            {
                root: true,
            }
        );

        commit(
            'posts/SET_ITEMS_PAGINATED',
            preloadedPostsPaginated,
            {
                root: true,
            }
        );

        commit(
            'comments/SET_ITEMS',
            preloadedComments,
            {
                root: true,
            }
        );

        commit(
            'comments/SET_ITEMS_PAGINATED',
            preloadedCommentsPaginated,
            {
                root: true,
            }
        );

        commit(
            'graphql/SET_ITEMS',
            preloadedGraphQl,
            {
                root: true,
            }
        );

        commit(
            'locations/SET_ITEMS',
            preloadedLocations,
            {
                root: true,
            }
        );

        commit(
            'locations/SET_ITEMS_PAGINATED',
            preloadedLocationsPaginated,
            {
                root: true,
            }
        );

    },
};
