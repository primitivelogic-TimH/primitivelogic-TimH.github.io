  // Untitled Project - created with Gulp Fiction
  var gulp = require("gulp");
  var plumber = require('gulp-plumber');
  var sass = require('gulp-sass');
  var uglify = require('gulp-uglify');
  var uglifycss = require('gulp-uglifycss');
  var concat = require("gulp-concat");
  
  gulp.task("default", [
  'sass',
  'js:prod',
  'html:prod',
  'css:prod'
]);
  gulp.task('html:prod', function () {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./'));
  });
gulp.task('sass', function () {
    gulp.src('./src/scss/theme.scss')
        .pipe(plumber())
		.pipe(sass())
        .pipe(gulp.dest('src/css'));
});
  gulp.task('css:prod', function () {
    gulp.src('./src/**/*.css')
        .pipe(concat("global.css"))
        .pipe(uglifycss())
        .pipe(gulp.dest('./css'));
  });
  gulp.task('js:prod', function(){
        gulp.src('./src/js/*.js')
            .pipe(concat("global.js"))
            .pipe(uglify({preserveComments : false,mangle : false}))
            .pipe(gulp.dest('js'));
    });
  gulp.task('watch:production', function() {
  gulp.watch('./src/scss/*.scss', ['css:prod']);
  gulp.watch('./src/js/*.js', ['js:prod']);
  gulp.watch('./src/*.html', ['html:prod']);
  });
  gulp.task('build', function() {
  gulp.start('sass:build', 'js:prod', 'html:prod', 'css:prod');
  });