'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');

var indexFile = "src/index.html";
var cssOutFile = "css/all.min.css";
var jsOutFile = "js/all.min.js";

var vendorJs = [
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js',
    'node_modules/angular-animate/angular-animate.min.js'
];

var vendorCss = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
];

var vendorFonts = [
    'node_modules/bootstrap/dist/fonts/*'
];

// Error handler
function handleError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Process and minify HTML files and copy to build/
gulp.task('html', function() {
    var indexFilter = plugins.filter('index.html', { restore: true });

    return gulp.src('src/**/*.html')
        .pipe(indexFilter)
        .pipe(plugins.injectString.replace('<!--INJECTCSS-->', '<link rel="stylesheet" href="' + cssOutFile + '">'))
        .pipe(plugins.injectString.replace('<!--INJECTJS-->', '<script src="' + jsOutFile + '"></script>'))
        .pipe(indexFilter.restore)
        .pipe(plugins.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build'));
});

// Concatenate, uglify, and copy JS to build/
gulp.task('scripts', function() {
    return gulp.src('src/**/*.js')
        .pipe(plugins.ngAnnotate()).on('error', handleError)
        .pipe(plugins.angularFilesort())
        .pipe(plugins.addSrc.prepend(vendorJs)) // Add vendor scripts to beginning of stream
        .pipe(plugins.concat(jsOutFile))
        .pipe(plugins.uglify({ preserveComments: 'license' })).on('error', handleError)
        .pipe(gulp.dest('build'));
});

// Concatenate, compile SASS, and copy CSS to build/
gulp.task('styles', function() {
    var src = vendorCss.concat(['src/**/*.+(css|scss)']);
    var sassFilter = plugins.filter('**/*.scss', { restore: true });

    return gulp.src(src)
        .pipe(sassFilter)
        .pipe(plugins.sass())
        .pipe(sassFilter.restore)
        .pipe(plugins.concat(cssOutFile))
        .pipe(plugins.cssnano())
        .pipe(gulp.dest('build'));
});

// Copy images relatively from src/ to build/
gulp.task('images', function() {
    return gulp.src('src/**/*.+(ico|jpg)')
        .pipe(gulp.dest('build'));
});

// Copy fonts to build/
gulp.task('fonts', function() {
    return gulp.src(vendorFonts)
        .pipe(gulp.dest('build/fonts'));
});

// Clean the build/ directory
gulp.task('clean', function() {
    return del([
        'build/*'
    ]);
});

// Watch files for changes and update build
gulp.task('watch', function() {
    gulp.watch('src/**/*.html', ['html']);
    gulp.watch('src/**/*.js', ['scripts']);
    gulp.watch('src/**/*.+(css|scss)', ['styles']);
    gulp.watch('src/**/*.+(ico|jpg)', ['images']);
});

gulp.task('default', ['html','scripts', 'styles', 'images', 'fonts']);
