// === MODERNIZR
// ============================================================================

module.exports = function(gulp, plugins){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('modernizr', function() {

      var modernizrFilter = plugins.filter(['**/**', '!**/*.css', '!**/js/*.js', '!**/vendor/*.js']);

      gulp.src(path.to.allFiles)
        .pipe(modernizrFilter)
        .pipe(plugins.modernizr('modernizr-custom.js', {
          "options" : [
            "setClasses",
            "addTest",
            "html5shiv",
            "testProp",
            "fnBind"
          ]
        }))
        // .pipe(plugins.uglify())
        .pipe(gulp.dest(path.to.js.vendor))

    });

};