var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');

var paths = {
  sass: ['./scss/**/*.scss']
};

gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

//build release

var templateCache = require('gulp-angular-templatecache');
var ngAnnotate = require('gulp-ng-annotate');
var replace = require('gulp-replace');
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var clean = require('gulp-clean');


gulp.task('build:release', ['templatecache', 'ng_annotate', 'replace_urls', 'prepare_index', 'useref', 'post_build']);


gulp.task('templatecache', function(done){
  gulp.src('./www/templates/*.html')
    .pipe(templateCache({module:'starter'}))
    .pipe(gulp.dest('./www/dist/tmp'))
    .on('end', done);
});

gulp.task('ng_annotate', ['templatecache'], function (done) {
  gulp.src('./www/js/*.js')
    .pipe(ngAnnotate({single_quotes: true}))
    .pipe(gulp.dest('./www/dist/tmp'))
    .on('end', done);
});

/*
* change urls in app.js
* */
gulp.task('replace_urls', ['ng_annotate'], function (done) {
  gulp.src('./www/dist/tmp/app.js')
    .pipe(replace('templates/', ''))
    .pipe(gulp.dest('./www/dist/tmp'))
    .on('end', done);
});

/*
* 1-remove 3 imports
* <script src=\"cordova.js\"></script>"
* <script src=\"js/app.js\"></script>
* <script src=\"js/controllers.js\"></script>
* 2-add 3 imports (replace <!--insert:#-->)
* <script src="dist/tmp/templates.js"></script>     <!--insert:1-->
* <script src="dist/tmp/app.js"></script>           <!--insert:2-->
* <script src="dist/tmp/controllers.js"></script>   <!--insert:3-->
* */
gulp.task('prepare_index', ['replace_urls'], function (done) {
  gulp.src('./www/index.html')
      //remove 3 imports
    .pipe(replace("<script src=\"cordova.js\"></script>", ''))
    .pipe(replace("<script src=\"js/app.js\"></script>", ''))
    .pipe(replace("<script src=\"js/controllers.js\"></script>", ''))
      //add 3 imports
    .pipe(replace("<!--insert:1-->", "<script src=\"dist/tmp/app.js\"></script>"))
    .pipe(replace("<!--insert:2-->", "<script src=\"dist/tmp/controllers.js\"></script>"))
    .pipe(replace("<!--insert:3-->", "<script src=\"dist/tmp/templates.js\"></script>"))

    .pipe(rename({ extname: '.htmlt' }))
    .pipe(gulp.dest('./www/'))
    .on('end', done);
});

gulp.task('useref', ['prepare_index'], function (done) {
  gulp.src('./www/*.htmlt')
    .pipe(useref())
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minifyCss()))
    .pipe(gulpif('*.htmlt', rename({ extname: '.html' })))
    .pipe(gulp.dest('./www/dist'))
    .on('end', done);
});

/*
 * -add import
 *   <script src=\"cordova.js\"></script>"
 * -delete tmp folder
 * -delete tmp index
 * -cp img folder to dist
 * */
gulp.task('post_build', ['useref'], function () { //['useref'],
  gulp.src('./www/dist/index.html')
    //add cordova import
    .pipe(replace("<!--insert:4-->", "<script src=\"cordova.js\"></script>"))
    .pipe(gulp.dest('./www/dist/'));

    //clean
  gulp.src(['./www/dist/tmp', './www/*.htmlt'], {read: false})
    .pipe(clean());

  gulp.src('./www/img/*')
    .pipe(gulp.dest('./www/dist/img'));
});

