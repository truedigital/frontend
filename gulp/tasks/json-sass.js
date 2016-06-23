// === JSON SASS
// ============================================================================

// Note: This task is used to generate a sass map for colours

module.exports = function(gulp, gutil, plugins, jsonSass, fs, source){

    var path = require('../settings/paths'),
        error = require('../settings/error-handler');

    gulp.task('json-sass', function() {

        // Convert the JSON colors to a sass-map
        return fs.createReadStream('./assets/json/colors.json')
            .pipe(jsonSass({
              prefix: '$palettes: ',
            }))
            .pipe(source('./assets/json/colors.json'))
            .pipe(plugins.rename('_colors.scss'))
            .pipe(gulp.dest('./assets/scss/base'));

    });

};
