// === CONFIG
// ============================================================================

module.exports =
{

    environment: {

        development: {
            name: 'development',
            local: false,
            sassStyle: 'nested',
            sourceMap: true,
        },

        production: {
            name: 'production',
            local: true,
            sassStyle: 'compressed',
            sourceMap: false,
        },

    },

    svgConfig: {
        mode: {
            view: {
                bust: false,
                render: {
                    scss: true
                }
            },
            symbol: true
        }
    }

};
