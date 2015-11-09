// === TEMPLATES
// ============================================================================

module.exports = function(gulp, gutil, plugins, browserSync, assemble){

    var env = require('../settings/config').environment.production,
        path = require('../settings/paths'),
        error = require('../settings/error-handler');

    if ( gutil.env.dev === true ) {
        env = require('../settings/config').environment.development
    }

    gulp.task('templates', function (done) {

      assemble({
        layouts: 'assets/templates/views/layouts/*',
        layoutIncludes: 'assets/templates/views/layouts/includes/*',
        views: ['assets/templates/views/**/*', '!assets/templates/views/+(layouts)/**'],
        materials: 'assets/templates/materials/**/*',
        data: 'assets/templates/data/**/*.{json,yml}',
        docs: 'assets/templates/docs/**/*.md',
        dest: 'assets/html',
        helpers: {
            markdown: require('helper-markdown'),
            svgSymbols: require('../../assets/templates/helpers/svgSymbols.js')
        }
      });

      done();

    });

};