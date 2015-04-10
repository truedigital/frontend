// === BROWSER-SYNC
// ============================================================================

module.exports = function(gulp, browserSync){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('browser-sync', function() {
        browserSync({
            server: {
                baseDir: './',
                directory: true
            },
            open: false
        });
    });

    gulp.task('browser-sync-templates', function() {
        browserSync({
            server: {
                baseDir: './',
                directory: true
            },
            ghostMode: {
                clicks: true,
                location: true,
                forms: true,
                scroll: true
            },
            startPath: "assets/html",
            open: true
        });
    });

};