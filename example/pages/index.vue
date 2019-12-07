<template>
    <main>
        <h1>NUXT Apis to file</h1>
        <h2>Nuxt module to merge and transform API calls into a single file, during the build phase.. Like a payload extractor</h2>
        <hr>
        <section class="comments">
            <h3>
                <strong>Total number of comments preloaded:</strong>
            </h3>
            <p>
                <em class="number" v-text="$store.state.comments.items.length" />
            </p>
        </section>
        <section class="posts">
            <h3>
                <strong>Total number of posts preloaded:</strong>
            </h3>
            <p>
                <em class="number" v-text="$store.state.posts.items.length" />
            </p>
        </section>
        <section class="users">
            <h3>
                <strong>Total number of users preloaded:</strong>
            </h3>
            <p>
                <em class="number" v-text="$store.state.users.items.length" />
            </p>
        </section>
    </main>
</template>

<script>
    export default {};
</script>
