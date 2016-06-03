// === PATHS
// ============================================================================

var path = require('path'),
    _baseDir  = './assets';

module.exports =
{

    to: {

        allFiles: path.join(_baseDir, '/**/**.**'),

        css: {
            source: path.join(_baseDir, '/css'),
            files: path.join(_baseDir, '/css/*.css'),
        },

        scss:{
            source: path.join(_baseDir, '/scss'),
            files: path.join(_baseDir, '/scss/**/*.scss'),
        },

        js: {
            source: path.join(_baseDir, '/js'),
            partials: path.join(_baseDir, '/js/partials/**'),
            styleguideJs: path.join(_baseDir, '/js/styleguide/**'),
            vendor: path.join(_baseDir, '/js/vendor'),
            scripts: path.join(_baseDir, '/js/scripts'),
        },

        json: {
            source: path.join(_baseDir, '/json'),
            files: path.join(_baseDir, '/json/*.json'),
        },

        templates: {
            allFiles: path.join(_baseDir, '/templates/**'),
            data: path.join(_baseDir, '/templates/data'),
            docs: path.join(_baseDir, '/templates/docs'),
            materials: path.join(_baseDir, '/templates/materials'),
            views: path.join(_baseDir, '/templates/views'),
            layouts: path.join(_baseDir, '/templates/views/layouts'),
            layoutIncludes: path.join(_baseDir, '/templates/views/layouts/includes'),
            dest: path.join(_baseDir, '/html'),
        },

        svg: {
            source: path.join(_baseDir, '/svg'),
            files: path.join(_baseDir, '/svg/icons/*.svg'),
            symbols: path.join(_baseDir, '/svg/symbol/svg/sprite.symbol.svg'),
        },

        images: path.join(_baseDir, '/images'),

    }

};













