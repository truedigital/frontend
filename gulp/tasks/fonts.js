// === FONTS
// ============================================================================

module.exports = function(gulp, plugins, browserSync){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('fonts', function () {

        browserSync.notify('Running fonts');

        return gulp.src(path.to.fonts.source)
            .pipe( plugins.changed(path.to.dist.fonts) )
            .pipe( gulp.dest(path.to.dist.fonts) );
    });

};