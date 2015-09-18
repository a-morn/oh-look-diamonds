var gulp = require('gulp');
var inject = require('gulp-inject');
var mainFiles = require('main-bower-files');
var connect = require('gulp-connect');
var del = require('del');
var concat = require('gulp-concat');
var order = require('gulp-order');

gulp.task('inject', ['move'], function(){
  return gulp.src('dist/index.html')
    .pipe(inject(gulp.src('dist/js/vendor.js'), {relative: true, name: 'bower'}))
    .pipe(inject(gulp.src('dist/js/main.js'), {relative: true}))
    .pipe(gulp.dest('dist'));
});

gulp.task('copyVendorJS', ['clean'], function(){
  return gulp.src(mainFiles())
    .pipe(order(['angular.js', 'angular-ui-router.js']))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copyAssets', ['clean'], function(){
  return gulp.src('src/assets/*/*.*')
    .pipe(gulp.dest('dist/assets'));
});

gulp.task('copyHtml', ['clean'], function(){
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('copyJs', ['clean'], function(){
  return gulp.src('src/js/*.js')
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('copyCss', ['clean'], function(){
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest('dist/css'));
});

gulp.task('move', ['copyVendorJS', 'copyAssets', 'copyHtml', 'copyJs', 'copyCss']);

gulp.task('clean', function () {
    return del('dist');
});

gulp.task('run', ['inject'],function() {
  connect.server({
    root: 'dist'
  });
});

gulp.task('default', ['run']);
