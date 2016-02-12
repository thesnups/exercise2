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

// Clean the build/ directory
gulp.task('clean', function() {
    return del([
        'build/*'
    ]);
});

gulp.task('default', []);
