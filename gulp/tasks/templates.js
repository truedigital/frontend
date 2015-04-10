// === TEMPLATES
// ============================================================================

module.exports = function(gulp, gutil, plugins, browserSync){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('templates', function() {
        return gulp.src(path.to.templates.files)
            .pipe(plugins.fileInclude({
                prefix: '@@',
                basepath: '@file'
            })).on('error', error.handleError)
            .pipe(plugins.rename({ extname: '.html' }))
            .pipe(gulp.dest(path.to.templates.destination));
            browserSync.reload();
            browserSync.notify('Template updated');
    });

};