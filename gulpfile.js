  // Untitled Project - created with Gulp Fiction
  var gulp = require("gulp");
  var sass = require('gulp-sass');
  var uglify = require('gulp-uglify');
  var uglifycss = require('gulp-uglifycss');
  var concat = require("gulp-concat");
  gulp.task("default", [], function () {
  });


  gulp.task('html:prod', function () {
  gulp.src('./src/*.html')
    .pipe(gulp.dest('./'));
  });
  gulp.task('css:prod', function () {
    gulp.src(['./src/css/*.css','./src/sass/*.scss'])
        //.pipe(sass())
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
  gulp.start('css:prod', 'js:prod', 'html:prod');
  });