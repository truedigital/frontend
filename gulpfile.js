// === GULP MAGIC
// ============================================================================
var argv = require('yargs').argv,
    gulp = require('gulp'),
    gutil = require('gulp-util');

// BROWSER SYNC
var browserSync = require('browser-sync'),
    reload      = browserSync.reload;

// LOAD PLUGINS
var plugins = require("gulp-load-plugins")({
    pattern: ['gulp-*', 'gulp.*'],
    replaceString: /\bgulp[\-.]/
});

// ENV SETTINGS


var config = require('./gulp/settings/config'),
    path = require('./gulp/settings/paths');

// var env = require('./gulp/settings/config').production

// if ( gutil.env.dev === true ) {
//     env = require('./gulp/settings/config').development
// }

// === ERROR HANDLING
// ============================================================================
function formatError(err) {
    console.log(err);
    var errorString = '[' + err.plugin + ']';
    errorString += ' ' + err.message.plugins.replace("\n",'');
    if(err.fileName)
        errorString += ' in ' + err.fileName;
    if(err.lineNumber)
        errorString += ' on line ' + err.lineNumber;
    return errorString;
}

function handleError(err) {
    gutil.log(gutil.colors.green(err));
    browserSync.notify(formatError(err), 360000);
    this.emit('end');
};




require('./gulp/tasks/styles')(gulp, gutil, path, plugins);

// process.exit(1);


// JAVASCRIPT
//==============================================================================

gulp.task('scripts', function () {
    browserSync.notify('Running scripts');

    return gulp.src(path.to.js.partials + '/*.js')
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat('scripts.js'))
        .on('error', handleError)
        .pipe(plugins.sourcemaps.write())
        .pipe(gulp.dest(path.to.js.source))

        .pipe( isProduction ? plugins.uglify({ preserveComments: 'some' }) : gutil.noop() )
        .on('error', handleError)
        .pipe( isProduction ? plugins.rename('scripts.min.js') : gutil.noop() )
        .pipe( isProduction ? gulp.dest(path.to.js.source) : gutil.noop() )
        .pipe(browserSync.reload({stream:true, once: true}))

});




// MODERNIZR
//==============================================================================

// gulp.task('modernizr', function() {

//   var modernizrFilter = plugins.filter(['**/**', '!**/*.css', '!**/js/*.js', '!**/vendor/*.js']);

//   gulp.src(files.allFiles)
//     .pipe(modernizrFilter)
//     .pipe(plugins.modernizr('modernizr-custom.js', {
//       "options" : [
//         "setClasses",
//         "addTest",
//         "html5shiv",
//         "testProp",
//         "fnBind"
//       ]
//     }))
//     // .pipe(plugins.uglify())
//     .pipe(gulp.dest(paths.jsVendor))

// });



// SVG ICONS
//==============================================================================
// gulp.task('sprites', function () {

//     browserSync.notify('Running svg sprites');

//     return gulp.src(files.svg)
//         .pipe(plugins.svgSprite({
//             svgId: "svg-%f",
//             mode: "symbols",
//             cssFile: path.join(_baseDir, 'scss/_sprite.scss'),
//             svg: {
//                 symbols: "symbols.svg"
//             }
//         }))
//         .pipe(gulp.dest(paths.svg));
// });





// TEMPLATES
//==============================================================================
gulp.task('templates', function() {
    return gulp.src(path.to.templates.files)
        .pipe(plugins.fileInclude({
            prefix: '@@',
            basepath: '@file'
        })).on('error', handleError)
        .pipe(plugins.rename({ extname: '.html' }))
        .pipe(gulp.dest(path.to.templates.destination));
        browserSync.reload();
        browserSync.notify('Template updated');
});




// BROWSER-SYNC
//==============================================================================
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
    // gulp.watch(files.svg, ['sprites', browserSync.reload]);
}

