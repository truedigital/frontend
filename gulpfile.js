// === GULP MAGIC
// ============================================================================
var argv = require('yargs').argv,
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    fs = require('fs'),
    runSequence = require('run-sequence'),
    path = require('./gulp/settings/paths')

// FABRICATOR
var assemble = require('fabricator-assemble');

// BROWSER SYNC
var browserSync = require('browser-sync'),
    reload      = browserSync.reload;

// JSON SASS
var jsonSass = require('json-sass'),
    source = require('vinyl-source-stream');

// LOAD PLUGINS
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// === TASKS
// ==============================================================================
require('./gulp/tasks/json-sass')(gulp, gutil, plugins, jsonSass, fs, source);
require('./gulp/tasks/styles')(gulp, gutil, plugins, browserSync, jsonSass, source);
require('./gulp/tasks/images')(gulp, plugins, browserSync);
require('./gulp/tasks/scripts')(gulp, gutil, plugins, browserSync);
require('./gulp/tasks/styleguide')(gulp, gutil, plugins, browserSync);
require('./gulp/tasks/templates')(gulp, gutil, plugins, browserSync, assemble);
require('./gulp/tasks/browser-sync')(gulp, browserSync);
require('./gulp/tasks/sprites')(gulp, plugins, browserSync);
require('./gulp/tasks/modernizr')(gulp, plugins, browserSync);

// GULP
//==============================================================================

gulp.task('default', function () {
    // gulp.start('styles', 'scripts', 'templates');
    runSequence('json-sass', ['styles', 'scripts', 'styleguide-scripts'], 'templates');
});

gulp.task('build' , function () {
    gulp.start('modernizr');
});

gulp.task('watch', ['default', 'browser-sync'], function () {
    watchFiles();
});

gulp.task('watch-templates', ['default', 'browser-sync-templates'], function () {
    watchFiles();
});

function watchFiles(){
    gulp.watch(path.to.scss.files, ['styles']);
    gulp.watch(path.to.json.files, ['json-sass']);
    gulp.watch(path.to.js.partials, ['scripts']);
    gulp.watch(path.to.images.source, ['images']);
    gulp.watch(path.to.js.styleguideJs, ['styleguide-scripts']);
    gulp.watch(path.to.templates.allFiles, ['templates', browserSync.reload]);
    gulp.watch(path.to.svg.files, ['sprites', browserSync.reload]);
}