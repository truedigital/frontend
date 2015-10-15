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
            partials: path.join(_baseDir, '/js/partials'),
            vendor: path.join(_baseDir, '/js/vendor'),
            scripts: path.join(_baseDir, '/js/scripts'),
        },

        templates: {
            source: path.join(_baseDir, '/templates'),
            files: path.join(_baseDir, '/templates/*.html'),
            partials: path.join(_baseDir, '/templates/partials/**/*.hbs'),
            data: path.join(_baseDir, '/templates/data/**/*.json'),
            helpers: path.join(_baseDir, '/templates/helpers/*.js'),
            destination: path.join(_baseDir, '/html'),
        },

        svg: {
            source: path.join(_baseDir, '/svg'),
            files: path.join(_baseDir, '/svg/icons/*.svg'),
        },

        images: path.join(_baseDir, '/images'),

    }

};













