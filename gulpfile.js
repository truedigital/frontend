// === GULP MAGIC
// ============================================================================
var argv = require('yargs').argv,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    path = require('./gulp/settings/paths')

// BROWSER SYNC
var browserSync = require('browser-sync'),
    reload      = browserSync.reload;

// LOAD PLUGINS
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// === TASKS
// ==============================================================================
require('./gulp/tasks/styles')(gulp, gutil, plugins, browserSync);
require('./gulp/tasks/scripts')(gulp, gutil, plugins, browserSync);
require('./gulp/tasks/templates')(gulp, gutil, plugins, browserSync);
require('./gulp/tasks/browser-sync')(gulp, browserSync);
require('./gulp/tasks/sprites')(gulp, plugins, browserSync);
require('./gulp/tasks/modernizr')(gulp, plugins, browserSync);

// GULP
//==============================================================================

gulp.task('default', function () {
    gulp.start('styles', 'scripts', 'templates');
});

gulp.task('build' , function () {
    gulp.start('modernizr', 'img-compress');
});

gulp.task('watch', ['default', 'browser-sync'], function () {
    watchFiles();
});

gulp.task('watch-templates', ['default', 'browser-sync-templates'], function () {
    watchFiles();
});


function watchFiles(){
    gulp.watch(path.to.scss.files, ['styles']);
    gulp.watch(path.to.js.partials, ['scripts']);
    gulp.watch(path.to.templates.files, ['templates', browserSync.reload]);
    gulp.watch(path.to.templates.partials, ['templates', browserSync.reload]);
    gulp.watch(files.svg, ['sprites', browserSync.reload]);
}