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
