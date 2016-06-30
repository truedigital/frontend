// === IMAGE OPTIMISATION
// ============================================================================

module.exports = function(gulp, plugins, browserSync) {

  var krakenConfig = require('../settings/config').kraken,
    path = require('../settings/paths'),
    error = require('../settings/error-handler');

  gulp.task('images', function() {

    browserSync.notify('Running image optimisations');

    var imageStream = gulp.src(path.to.images.source)
      .pipe(plugins.changed(path.to.dist.images))
      .pipe(gulp.dest(path.to.dist.images));

    if (krakenConfig.secret !== '' && krakenConfig.key !== '') {
      return imageStream.pipe(plugins.kraken(krakenConfig));
    } else {
      return imageStream;
    }
  });

};