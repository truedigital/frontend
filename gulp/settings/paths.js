// var _baseDir  = './assets';

// var paths = {
//     css:        path.join(_baseDir, 'css'),
//     scss:       path.join(_baseDir, 'scss'),
//     js:         path.join(_baseDir, 'js'),
//     jsPartials: path.join(_baseDir, 'js/partials'),
//     jsVendor:   path.join(_baseDir, 'js/vendor'),
//     scripts:    path.join(_baseDir, 'js/scripts'),
//     svg:        path.join(_baseDir, 'svg'),
//     templates:  path.join(_baseDir, 'templates'),
//     html:       path.join(_baseDir, 'html'),
//     imageSrc:   path.join(_baseDir, 'images/src'),
//     imageDist:  path.join(_baseDir, 'images/dist'),
// }

// var files = {
//     scss:       path.join(paths.scss, '**/*.scss'),
//     css:        path.join(paths.css, '*.css'),
//     jsPartials: path.join(paths.jsPartials, '*.js'),
//     scripts:    [path.join(paths.scripts, '*.js'), '!'+path.join(paths.scripts, '*.min.js')],
//     svg:        path.join(paths.svg, 'icons/*.svg'),
//     templates:  path.join(paths.templates, '*.tpl'),
//     partials:   path.join(paths.templates, '**/*'),
//     imageSrc:   path.join(paths.imageSrc, '**/**.**'),
//     allFiles:   path.join(_baseDir, '**/**.**'),
// };


// === PATHS
// ============================================================================

var _baseDir  = './assets';

module.exports =
{

    to: {

        allFiles: _baseDir + '/**/**.**',

        css: {
            source: _baseDir + '/css',
            files: _baseDir + '/css/*.css',
        },

        scss:{
            source: _baseDir + '/scss',
            files: _baseDir + '/scss/**/*.scss',
        },

        js: {
            source: _baseDir + '/js',
            partials: _baseDir + '/js/partials',
            vendor: _baseDir + '/js/vendor',
            scripts: _baseDir + '/js/scripts',
        },

        templates: {
            source: _baseDir + '/templates',
            files: _baseDir + '/templates/*.tpl',
            partials: _baseDir + '/templates/**/*',
            destination: _baseDir + '/html',
        },

        svg: {
            source: _baseDir + '/svg',
            files: _baseDir + '/svg/icons/*.svg',
        },

        images: _baseDir + '/images',

    }

};













