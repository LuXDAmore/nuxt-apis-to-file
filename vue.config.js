// Exports
module.exports = {
    lintOnSave: true,
    productionSourceMap: false,
    chainWebpack(
        config,
    ) {

        config.resolve.symlinks(
            false,
        );

        config
            .module
            .rule(
                'vue',
            )
            .use(
                'vue-loader',
            )
            .loader(
                'vue-loader',
            )
            .tap(
                options => {

                    options.compilerOptions.preserveWhitespace = false;
                    options.compilerOptions.whitespace = 'condense';

                    return options;

                },
            )
        ;

    },
};
