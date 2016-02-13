'use strict';

var gulp = require('gulp');
var del = require('del');
var concat = require('gulp-concat');
var ngAnnotate = require('gulp-ng-annotate');
var uglify = require('gulp-uglify');
var filter = require('gulp-filter');
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var htmlmin = require('gulp-htmlmin');

var vendorJs = [
    'node_modules/angular/angular.min.js'
];

var vendorCss = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
];

function handleError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Minify HTML files and copy to build/
gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build'));
});

// Concatenate, uglify, and copy JS to build/
gulp.task('scripts', function() {
    var src = vendorJs.concat(['src/**/*.js']);

    return gulp.src(src)
        .pipe(concat('all.min.js'))
        .pipe(ngAnnotate()).on('error', handleError)
        .pipe(uglify({ preserveComments: 'license', mangle: false })).on('error', handleError)
        .pipe(gulp.dest('build'));
});

// Concatenate, compile SASS, and copy CSS to build/
gulp.task('styles', function() {
    var src = vendorCss.concat(['src/**/*.+(css|scss)']);
    var sassFilter = filter('**/*.scss', { restore: true });

    return gulp.src(src)
        .pipe(sassFilter)
        .pipe(sass())
        .pipe(sassFilter.restore)
        .pipe(concat('all.min.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('build'));
});

// Copy images from src/ to build/
gulp.task('images', function() {
    return gulp.src('src/**/*.+(ico|jpg)')
        .pipe(gulp.dest('build'));
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

gulp.task('default', ['html', 'scripts', 'styles', 'images']);
