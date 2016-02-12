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
    'node_modules/angular/angular.min.js',
    'node_modules/angular-route/angular-route.min.js'
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
    gulp.watch('src/**/*.+(ico|jpg)', ['images']);
});

gulp.task('default', ['html', 'images']);
