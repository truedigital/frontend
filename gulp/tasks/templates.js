// === TEMPLATES
// ============================================================================

module.exports = function(gulp, gutil, plugins, browserSync){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler'),
        layouts = require('handlebars-layouts');

        layouts.register(plugins.hb.handlebars);

    gulp.task('templates', function () {
        return gulp.src(path.to.templates.files)
            .pipe(plugins.hb({
                data: path.to.templates.data,
                helpers: [
                  './node_modules/handlebars-layouts/index.js',
                  path.to.templates.helpers
                ],
                partials: path.to.templates.partials
            })).on('error', error.handleError)
            .pipe(gulp.dest(path.to.templates.destination));
            browserSync.reload();
            browserSync.notify('Template updated');
    });

};