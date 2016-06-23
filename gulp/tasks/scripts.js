// === SCRIPTS
// ============================================================================

module.exports = function(gulp, gutil, plugins, browserSync){

    var env = require('../settings/config').environment.production,
        path = require('../settings/paths'),
        error = require('../settings/error-handler');

    if ( gutil.env.dev === true ) {
        env = require('../settings/config').environment.development
    }

    gulp.task('scripts', function () {

        browserSync.notify('Running scripts');

        return gulp.src(path.to.js.partials)
            .pipe(plugins.sourcemaps.init())
            .pipe(plugins.concat('scripts.js'))
            .on('error', error.handleError)
            .pipe(plugins.sourcemaps.write())
            .pipe(gulp.dest(path.to.js.source))

            .pipe( env.local ? plugins.uglify({ preserveComments: 'some' }) : gutil.noop() )
            .on('error', error.handleError)
            .pipe( env.local ? plugins.rename({ suffix: '.min' }) : gutil.noop() )
            .pipe( env.local ? gulp.dest(path.to.js.source) : gutil.noop() )
            .pipe(browserSync.reload({stream:true, once: true}))

    });

};