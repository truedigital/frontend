// === SVG ICONS
// ============================================================================

module.exports = function(gulp, plugins, browserSync){

    var svgConfig = require('../settings/config').svgConfig,
        path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('sprites', function () {

        browserSync.notify('Running svg sprites');

        return gulp.src(path.to.svg.files)
            .pipe( plugins.svgSprite(svgConfig) )
            .pipe( gulp.dest(path.to.svg.source) );
    });

};