var gulp = require('gulp');
var inject = require('gulp-inject');
var mainFiles = require('main-bower-files');
var connect = require('gulp-connect');
var del = require('del');
var concat = require('gulp-concat');
var order = require('gulp-order');
var rootDir = 'public/';

gulp.task('inject', ['move'], function(){
  return gulp.src(rootDir + 'index.html')
    .pipe(inject(gulp.src(rootDir + 'js/vendor.js'), {relative: true, name: 'bower'}))
    .pipe(inject(gulp.src(rootDir + 'js/main.js'), {relative: true}))
    .pipe(gulp.dest(rootDir));
});

gulp.task('copyVendorJS', ['clean'], function(){
  return gulp.src(mainFiles())
    .pipe(order(['angular.js', 'angular-ui-router.js']))
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(rootDir + 'js'));
});

gulp.task('copyAssets', ['clean'], function(){
  return gulp.src('src/assets/*/*.*')
    .pipe(gulp.dest(rootDir + 'assets'));
});

gulp.task('copyHtml', ['clean'], function(){
  return gulp.src('src/*.html')
    .pipe(gulp.dest(rootDir));
});

gulp.task('copyJs', ['clean'], function(){
  return gulp.src(['src/js/**/*.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest(rootDir + 'js'));
});

gulp.task('copyCss', ['clean'], function(){
  return gulp.src('src/css/*.css')
    .pipe(gulp.dest(rootDir + 'css'));
});

gulp.task('move', ['copyVendorJS', 'copyAssets', 'copyHtml', 'copyJs', 'copyCss']);

gulp.task('clean', function () {
    return del(rootDir);
});

gulp.task('default', ['inject']);
