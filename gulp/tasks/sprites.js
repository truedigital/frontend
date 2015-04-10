// === SVG ICONS
// ============================================================================

module.exports = function(gulp, plugins, browserSync){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('sprites', function () {

        browserSync.notify('Running svg sprites');

        return gulp.src(path.to.svg.files)
            .pipe(plugins.svgSprite({
                svgId: "svg-%f",
                mode: "symbols",
                cssFile: path.to.scss.source + '/_sprite.scss',
                svg: {
                    symbols: "symbols.svg"
                }
            }))
            .pipe(gulp.dest(path.to.svg.source));
    });

};