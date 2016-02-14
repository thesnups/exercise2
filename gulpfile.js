'use strict';

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var del = require('del');

var vendorJs = [
    'node_modules/angular/angular.min.js'
];

var vendorCss = [
    'node_modules/bootstrap/dist/css/bootstrap.min.css'
];

var pipes = {};

// Stylesheets pipe
pipes.stylesPipe = function() {
    var src = vendorCss.concat(['src/**/*.+(css|scss)']);
    var sassFilter = plugins.filter('**/*.scss', { restore: true });

    return gulp.src(src)
        .pipe(sassFilter)
        .pipe(plugins.sass())
        .pipe(sassFilter.restore)
        .pipe(plugins.concat('all.min.css'))
        .pipe(plugins.cssnano());
}

// Scripts pipe
pipes.scriptsPipe = function() {
    return gulp.src('src/**/*.js')
        .pipe(plugins.angularFilesort())
        .pipe(plugins.ngAnnotate()).on('error', handleError)
        .pipe(plugins.addSrc.prepend(vendorJs)) // Add vendor scripts to beginning of stream
        .pipe(plugins.concat('all.min.js'))
        .pipe(plugins.uglify({ preserveComments: 'license', mangle: false })).on('error', handleError);
}

// Error handler
function handleError(error) {
    console.log(error.toString());
    this.emit('end');
}

// Minify HTML files and copy to build/
gulp.task('html', function() {
    return gulp.src('src/**/*.html')
        .pipe(plugins.inject(pipes.stylesPipe(), { relative: true }))
        .pipe(plugins.inject(pipes.scriptsPipe(), { relative: true }))
        .pipe(plugins.htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('build'));
});

// Concatenate, uglify, and copy JS to build/
gulp.task('scripts', function() {
    return pipes.scriptsPipe()
        .pipe(gulp.dest('build'));
});

// Concatenate, compile SASS, and copy CSS to build/
gulp.task('styles', function() {
    return pipes.stylesPipe()
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
