// === CONFIG
// ============================================================================

module.exports =
{

    environment: {

        development: {
            local: false,
            sassStyle: 'nested',
            sourceMap: true,
        },

        production: {
            local: true,
            sassStyle: 'compressed',
            sourceMap: false,
        },

    },

};
