
/**
 * development & production compilation task runner
 */

var gulp = require('gulp')
  , print = require('gulp-print')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , less = require('gulp-less')
  , jshint = require('gulp-jshint')
  , watch = require('gulp-watch')
  , rename = require('gulp-rename')
  , connect = require('gulp-connect')
  , cheerio = require('gulp-cheerio')
  , pages = require('gulp-gh-pages')
  , markdown = require('gulp-markdown')
  , imagemin = require('gulp-imagemin')
  , pngquant = require('imagemin-pngquant')
  , minifyCSS = require('gulp-minify-css')
  , sourcemaps = require('gulp-sourcemaps')
  , htmlreplace = require('gulp-html-replace')
  , markdownpdf = require('gulp-markdown-pdf')
  , templateCache = require('gulp-angular-templatecache');

/**
 * enable coffeescript
 */

require('coffee-script/register')

require('./tasks/publish')()

/**
 * templates -> to copies in /dist/
 */

gulp.task('templates:production', function () {
  gulp.src('./src/templates/**/*.html')
    .pipe(gulp.dest('./dist/templates/'));
});

/**
 * run jshint/lint on all of our non-library files
 */

gulp.task('hint:development', function () {
  gulp.src('./src/js/src/**/*.js')
    .pipe(watch(function(files) {
      files
      .pipe(jshint({
        laxcomma: true
      }))
      .pipe(jshint.reporter('default'));
    }
  ));
});

/**
 * concat all library files along with our
 * sources into a single file, build.js (NO TEMPLATES!)
 */

gulp.task('js:development', function () {
  var stream, _allFiles = [
    './bower_components/jquery/dist/jquery.min.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/matchmedia/matchMedia.min.js',
    './bower_components/hammerjs/hammer.min.js',
    './bower_components/wow/dist/wow.min.js',
    './bower_components/angular-gestures/gestures.js',
    './bower_components/ngSticky/dist/sticky.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap.min.js',
    './bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    './bower_components/angular-scroll/angular-scroll.min.js',
    './bower_components/angular-inview/angular-inview.js',
    './bower_components/angular-bindonce/bindonce.js',
    './bower_components/angular-cookies/angular-cookies.min.js',
    './bower_components/angular-resource/angular-resource.min.js',
    './bower_components/angular-local-storage/dist/angular-local-storage.min.js',
    './bower_components/angular-animate/angular-animate.min.js',
    './bower_components/angular-busy/angular-busy.js',
    './src/js/src/directives/directives.js',
    './src/js/src/services/services.js',
    './src/js/src/services/SessionService.js',
    './src/js/src/services/AlertsService.js',
    './src/js/src/services/APIService.js',
    './src/js/src/services/RightSlideMobileMenu.js',
    './src/js/src/controllers/controllers.js',
    './src/js/src/controllers/NavController.js',
    './src/js/src/controllers/FooterController.js',
    './src/js/src/controllers/StickyNavController.js',
    './src/js/src/directives/StaticPopover.js',
    './src/js/src/directives/JSONTextDirective.js',
    './src/js/src/directives/RightSideNav.js',
    './src/js/src/controllers/HomeController.js',
    './src/js/src/controllers/SafetyController.js',
    './src/js/src/controllers/AlertsController.js',
    './src/js/src/controllers/FormsController.js',
    './src/js/src/controllers/RebatesAndPromotionsController.js',
    './src/js/src/controllers/MasterController.js',
    './src/js/src/templates.js',
    './src/js/src/app.js'
  ];
  stream = gulp.src(_allFiles).pipe(watch(function (files) {
    return gulp.src(_allFiles)
      .pipe(sourcemaps.init({
        loadMaps: true
      }))
      .pipe(concat('build.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest('./src/js'))
      .pipe(gulp.dest('./dist/js'))
    }
  ));
  return stream;
});

/**
 * templates (only directive templates) to cache
 */

gulp.task('js:templates', function () {
  gulp.src('./src/templates/directives/**/*.html')
    .pipe(templateCache({
      standalone: true,
      root: 'templates/',
      module: 'app.templates'
    }))
    .pipe(gulp.dest('./src/js/src/'));
});

/**
 * take concatenated js build file, minify
 * into build.min.js
 */

gulp.task('js:production', function () {
  var stream = gulp.src('./src/js/build.js')
    .pipe(uglify({
      preserveComments : false,
      mangle : false
    }))
    .pipe(rename('build.min.js'))
    .pipe(gulp.dest('./dist/js'));
  return stream;
});

/**
 * move images to production folder
 */

gulp.task('images:production', function () {
  var stream = gulp.src('./src/images/**/*.png')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('./dist/images/'))
    .pipe(gulp.dest('./dist/images/'));
  return stream;
});

/**
 * move fonts to production folder
 */

gulp.task('fonts:production', function () {
  var stream = gulp.src('./src/fonts/**/*.*')
    .pipe(gulp.dest('./dist/fonts'));
  return stream;
});

/**
 * less files including full bootstrap, app.less
 * animate.less, headroom.less into one css
 * file: build.css
 */

gulp.task('less:development', function () {
  var stream = gulp.src('./src/less/app/**/*.less')
    .pipe(watch(function(files) {
      gulp.src('./src/less/main.less')
        .pipe(rename('build.css'))
        .pipe(less({
          compress : false
        }))
        .pipe(gulp.dest('./src/css'));
    }));
  return stream;
});

/**
 * take build.css and minify. remove all header
 * comments, rename to build.min.css
 */

gulp.task('css:production', function () {
  var stream = gulp.src('./src/css/build.css')
    .pipe(minifyCSS({
      keepSpecialComments : 0
    }))
    .pipe(rename('build.min.css'))
    .pipe(gulp.dest('./dist/css'));
  return stream;
});

/**
 * edit html for .min script/css
 */

gulp.task('html:production', function() {
  var stream = gulp.src('src/index.html')
    .pipe(htmlreplace({
      'css': 'css/build.min.css',
      'js':  'js/build.min.js'
    }))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/'))
  return stream;
});

/**
 * deploy to github pages
 */

gulp.task('pages', function () {
  var stream =  gulp.src([
    './src/js/**/*',
    './src/css/**/*',
    './src/fonts/**/*',
    './src/images/**/*',
    './src/templates/**/*'
  ])
  .pipe(pages());
  return stream;
});

/**
 * build documentation html from markdown
 */

gulp.task('docs', function () {
  gulp.src('README.md')
    .pipe(markdownpdf())
    .pipe(rename('README.pdf'))
    .pipe(gulp.dest('./'));
});

/**
 * src file server for testing
 */

gulp.task('server:development', function () {
  connect.server({
    root: [__dirname + '/src/'],
    port: 8000,
    livereload: true
  });
});

/**
 * production server
 */

gulp.task('server:production', function () {
  connect.server({
    root: [__dirname + '/dist/'],
    port: 8000,
    livereload: true
  });
});

/**
 * default/development tasks list
 */

gulp.task('default', [
  'hint:development',
  'less:development',
  'js:templates',
  'js:development',
  'server:development'
]);

/**
 * production build for /dist/
 */

gulp.task('production', [
  'less:development',
  'css:production',
  'templates:production',
  'html:production',
  'images:production',
  'fonts:production',
  'js:production'
]);

/* EOF */