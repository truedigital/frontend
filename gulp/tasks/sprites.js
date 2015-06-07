// === SVG ICONS
// ============================================================================

module.exports = function(gulp, plugins, browserSync){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('sprites', function () {

        browserSync.notify('Running svg sprites');

        return gulp.src(path.to.svg.files)

            .pipe(
                plugins.svgSymbols({
                    className: '.icon--%f',
                    title: false
                })
            )

            .pipe( gulp.dest(path.to.svg.source) );
    });

};