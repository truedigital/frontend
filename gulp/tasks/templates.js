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
        layouts: path.to.templates.layouts + '/*',
        layoutIncludes: path.to.templates.layoutIncludes + '/*',
        views: [path.to.templates.views + '/**/*',  '!' + path.to.templates.views + '/+(layouts)/**'],
        materials: path.to.templates.materials + '/**/*',
        data: [path.to.templates.data + '/**/*.{json,yml}', path.to.json.source + '/colors.json'],
        docs: path.to.templates.docs + '/**/*.md',
        dest: path.to.templates.dest,
        helpers: {
            markdown: require('helper-markdown'),
            svgSymbols: require('../../src/templates/helpers/svgSymbols.js'),
            json: require('../../src/templates/helpers/json.js'),
            toLowerCase: require('../../src/templates/helpers/toLowerCase.js')
        }
      });

      done();

    });

};