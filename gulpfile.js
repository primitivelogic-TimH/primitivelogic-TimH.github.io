  // Untitled Project - created with Gulp Fiction
  var gulp = require("gulp");
  var plumber = require('gulp-plumber');
  var inject = require('gulp-inject');
  var sass = require('gulp-sass');
  var uglify = require('gulp-uglify');
  var uglifycss = require('gulp-uglifycss');
  var concat = require("gulp-concat");
  var htmlclean = require('gulp-htmlclean');
  var gulpif = require('gulp-if');
  
  gulp.task("default", [
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
  
  
gulp.task('needle',function(){
  gulp.src('./src/template.html')
    .pipe(inject(gulp.src(['./src/metard.html']), {starttag: '<!-- inject:head:{{ext}} -->',transform: function (filePath, file) {
      // return file contents as string 
      return file.contents.toString('utf8')
      }
      }))
    .pipe(inject(gulp.src(['./src/footer.html']), {starttag: '<!-- inject:footer:{{ext}} -->',transform: function (filePath, file) {
      // return file contents as string 
      return file.contents.toString('utf8')
      }
      }))
    .pipe(htmlclean())
    .pipe(gulp.dest('./'));

      });