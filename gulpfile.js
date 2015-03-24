// initialize gulp plugins
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat');


// file and directory source variables
var coffeeSources = ['components/coffee/tagline.coffee'];
var jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
var sassSources = ['components/sass/style.scss'];
var htmlSources = ['builds/development/*.html'];
var cssSources = ['builds/development/css/*.css'];
var jsSources = ['builds/development/js/*.js'];
var jsonSources = ['builds/development/js/*.json'];

// compile coffee script to js
gulp.task('coffee', function() {
  gulp.src(coffeeSources)
    .pipe(coffee({ bare: true })
    .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'))
});

// concatenate all js
// add all required js libraries
// update js sources
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
});

// compile sass to css
// add compass libraries
// update sass sources
gulp.task('compass', function() {
  gulp.src(sassSources)
    .pipe(compass({
      sass: 'components/sass',
      image: 'builds/development/images',
      style: 'expanded'
    })
    .on('error', gutil.log))
    .pipe(gulp.dest('builds/development/css'))
    .pipe(connect.reload())
});

// watch and update sources
gulp.task('watch', function() {
  gulp.watch(coffeeSources, ['coffee']);
  gulp.watch(jsSources, ['js']);
  gulp.watch('components/sass/*.scss', ['compass']);
  gulp.watch(htmlSources, ['html']);
  gulp.watch(jsonSources, ['json']);
});

// create server 
gulp.task('connect', function() {
  connect.server({
    root: 'builds/development/',
    livereload: true
  });
});

// update html sources
gulp.task('html', function() {
  gulp.src(htmlSources)
    .pipe(connect.reload())
});

// update json sources
gulp.task('json', function() {
  gulp.src(jsonSources)
    .pipe(connect.reload())
});

// concatenate js
// add js libraries
// update js sources
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('builds/development/js'))
    .pipe(connect.reload())
});

// shrink all sources for production
gulp.task('production', function() {
  gulp.src(htmlSources)
    .pipe(minifyHTML())
    .pipe(gulp.dest('builds/production'))
  gulp.src(cssSources)  
    .pipe(minifycss())
    .pipe(gulp.dest('builds/production/css'))
  gulp.src(jsSources)
    .pipe(uglify())
    .pipe(gulp.dest('builds/production/js'))
  gulp.src(jsonSources)
    .pipe(jsonminify())
    .pipe(gulp.dest('builds/production/js'))
});

// run all gulp, except production
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);