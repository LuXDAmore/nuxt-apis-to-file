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

        let preloadedComments = []
            , preloadedPosts = []
            , preloadedGraphQl = {}
            , preloadedLocations = {}
        ;

        try {

            const {
                comments,
                posts,
                graphql,
                locations,
            } = await getFile();

            if( comments )
                preloadedComments = comments;
            if( posts )
                preloadedPosts = posts;
            if( graphql )
                preloadedGraphQl = graphql;
            if( preloadedLocations )
                preloadedLocations = locations;

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
            'locations/SET_ITEMS',
            preloadedLocations,
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

    },
};
