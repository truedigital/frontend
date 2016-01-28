// === CONFIG
// ============================================================================

module.exports =
{

    environment: {

        development: {
            name: 'development',
            local: false,
            sourceMap: true,
        },

        production: {
            name: 'production',
            local: true,
            sourceMap: false,
        },

    },

    svgConfig: {
        mode: {
            symbol: {
                inline: true,
                example: true
            }
        }
    }

};
