<template>
    <main class="page">
        <h1>NUXT Apis to file</h1>
        <h2>Nuxt module to merge and transform API calls into a single file, during the build phase.. Like a payload extractor</h2>
        <hr>
        <!-- Rest API -->
        <section class="posts">
            <h3>
                <strong>Total number of posts preloaded:</strong>
            </h3>
            <p v-if="$store.state.posts && $store.state.posts.items && $store.state.posts.items.length">
                <em
                    class="number"
                    v-text="$store.state.posts.items.length"
                />
            </p>
        </section>
        <section class="posts-paginated">
            <h3>
                <strong>Total number of posts (paginated) preloaded:</strong>
            </h3>
            <p v-if="$store.state.posts && $store.state.posts.paginated && $store.state.posts.paginated.length">
                <em
                    class="number"
                    v-text="$store.state.posts.paginated.length"
                />
            </p>
        </section>
        <section class="comments">
            <h3>
                <strong>Total number of comments preloaded:</strong>
            </h3>
            <p v-if="$store.state.comments && $store.state.comments.items && $store.state.comments.items.length">
                <em
                    class="number"
                    v-text="$store.state.comments.items.length"
                />
            </p>
        </section>
        <section class="comments-paginated">
            <h3>
                <strong>Total number of comments (paginated) preloaded:</strong>
            </h3>
            <p v-if="$store.state.comments && $store.state.comments.paginated && $store.state.comments.paginated.length">
                <em
                    class="number"
                    v-text="$store.state.comments.paginated.length"
                />
            </p>
        </section>
        <!-- GraphQL -->
        <section class="graphql">
            <h3>
                <strong>GraphQL Object loaded:</strong>
            </h3>
            <code v-if="$store.state.graphql && $store.state.graphql.data">
                <pre
                    class="number"
                    v-text="$store.state.graphql.data"
                />
            </code>
        </section>
        <section class="locations">
            <h3>
                <strong>Total number of locations preloaded:</strong>
            </h3>
            <p v-if="$store.state.locations && $store.state.locations.data">
                <em
                    v-if="$store.state.locations.data.items && $store.state.locations.data.items.length"
                    class="number"
                    v-text="$store.state.locations.data.items.length"
                />
                <em
                    v-if="$store.state.locations.data.nextToken"
                    class="next-token"
                    v-text="$store.state.locations.data.nextToken"
                />
            </p>
        </section>
        <section class="locations-paginated">
            <h3>
                <strong>Total number of locations (paginated) preloaded:</strong>
            </h3>
            <p v-if="$store.state.locations && $store.state.locations.paginated">
                <em
                    v-if="$store.state.locations.paginated && $store.state.locations.paginated.length"
                    class="number"
                    v-text="$store.state.locations.paginated.length"
                />
            </p>
        </section>
        <button
            type="button"
            title="Refresh"
            @click="refresh"
            @keyup.enter="refresh"
        >
            REFRESH
        </button>
    </main>
</template>

<script>
    export default {
        methods: {
            async refresh() {

                try {

                    await this.$store.dispatch(
                        'build-data/getDataFromFile',
                    );

                } catch( e ) {

                    console.error(
                        e
                    );

                }

            },
        },
    };
</script>

<style
    scoped
    src="./index.css"
></style>
