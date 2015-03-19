
var argv = require('yargs').argv;
var gulp = require('gulp');
var gutil = require('gulp-util');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var path = require('path');
var filter = require('gulp-filter');
var gulpif = require('gulp-if');
var size = require('gulp-size');
var header = require('gulp-header');

// === BROWSER SYNC
var browserSync = require('browser-sync');
var reload      = browserSync.reload;

// === UTILITIES
var sourcemaps = require('gulp-sourcemaps');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var fileinclude = require('gulp-file-include');
var svgSprite = require('gulp-svg-sprites');




// === PATHS
// ============================================================================
var _baseDir  = './assets';

var paths = {
    css:        path.join(_baseDir, 'css'),
    scss:       path.join(_baseDir, 'scss'),
    js:         path.join(_baseDir, 'js'),
    scripts:    path.join(_baseDir, 'js/scripts'),
    utils:      path.join(_baseDir, 'js/utils'),
    svg:        path.join(_baseDir, 'svg'),
    templates:  path.join(_baseDir, 'templates'),
    html:       path.join(_baseDir, 'html')
}

var files = {
    scss:       path.join(paths.scss, '**/*.scss'),
    css:        path.join(paths.css, '*.css'),
    scripts:    path.join(paths.scripts, '*.js'),
    utils:      [path.join(paths.utils, '*.js'), '!'+path.join(paths.utils, '*.min.js')],
    svg:        path.join(paths.svg, 'icons/*.svg'),
    templates:  path.join(paths.templates, '*.tpl'),
    partials:   path.join(paths.templates, '**/*')
};



// === ERROR HANDLING
// ============================================================================
function formatError(err) {
    console.log(err);
    var errorString = '[' + err.plugin + ']';
    errorString += ' ' + err.message.replace("\n",'');
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




// STYLES
//==============================================================================
// Note: Sourcemaps are not working at the moment when used with auto prefixer.
// If you comment in sourcemaps and comment out autoprefixer. maps work fine.
// I think autoprefixer wins over sourcemaps, so it's being used by default.

gulp.task('styles', function() {
    return gulp.src(path.join(paths.scss, 'style.scss'))

        // init sourcemaps
        .pipe(sourcemaps.init({debug: true}))

        // compile scss
        .pipe(sass({
            sourceComments : 'normal', // none|normal|map
            includePaths : ['scss'],
            errLogToConsole : true
        }))
        .on('error', handleError)

        // .pipe(sourcemaps.write())
        // .pipe(sourcemaps.init({loadMaps:true}))

        // auto prefixing
        .pipe(autoprefixer())
        .on('error', handleError)

        // update sourcemaps
        // .pipe(sourcemaps.write('.'))

        // save to file
        .pipe(gulp.dest(paths.css))

        // Trigger browsersync update
        .pipe(filter('**/*.css'), browserSync.reload({stream:true}))



        // Minify
        .pipe(minifycss())
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(paths.css))
        .pipe(size({ showFiles: false, gzip: true, title: 'STYLES'}))

});




// JAVASCRIPT
//==============================================================================

gulp.task('scripts', function () {
    browserSync.notify('Running scripts');

    return gulp.src(files.scripts)
        .pipe(sourcemaps.init())
        .pipe(concat('scripts.js'))
        .on('error', handleError)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.js))

        .pipe(uglify({ preserveComments: 'some' }))
        .on('error', handleError)
        .pipe(rename('scripts.min.js'))
        .pipe(gulp.dest(paths.js))
        .pipe(browserSync.reload({stream:true, once: true}))

});




// SVG ICONS
//==============================================================================
gulp.task('sprites', function () {

    browserSync.notify('Running svg sprites');

    return gulp.src(files.svg)
        .pipe(svgSprite({
            svgId: "svg-%f",
            mode: "symbols",
            cssFile: path.join(_baseDir, 'scss/_sprite.scss'),
            svg: {
                symbols: "symbols.svg"
            }
        }))
        .pipe(gulp.dest(paths.svg));
});





// TEMPLATES
//==============================================================================
gulp.task('templates', function() {
    return gulp.src(files.templates)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        })).on('error', handleError)
        .pipe(rename({ extname: '.html' }))
        .pipe(gulp.dest(paths.html));
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

gulp.task('watch', ['default', 'browser-sync'], function () {
    watchFiles();
});

gulp.task('watch-templates', ['default', 'browser-sync-templates'], function () {
    watchFiles();
});


function watchFiles(){
    gulp.watch(files.scss, ['styles']);
    gulp.watch(files.scripts, ['scripts']);
    gulp.watch(files.templates, ['templates', browserSync.reload]);
    gulp.watch(files.partials, ['templates', browserSync.reload]);
    gulp.watch(files.svg, ['sprites', browserSync.reload]);
}

