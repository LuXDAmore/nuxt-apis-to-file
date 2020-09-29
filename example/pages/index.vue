<template>
    <main>
        <h1>NUXT Apis to file</h1>
        <h2>Nuxt module to merge and transform API calls into a single file, during the build phase.. Like a payload extractor</h2>
        <hr>
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
        <section class="graphql">
            <h3>
                <strong>Total number graphql data preloaded:</strong>
            </h3>
            <code v-if="$store.state.graphql && $store.state.graphql.data">
                <pre
                    class="number"
                    v-text="$store.state.graphql.data"
                />
            </code>
        </section>
    </main>
</template>
