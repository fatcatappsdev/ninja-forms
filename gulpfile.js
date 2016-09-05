/**
 * Gulpfile
 *
 * Rename and Minify JavaScript... and more (later).
 *
 * Install Command:
 * npm install
 *
 * Running Command:
 * npm run gulp
 */

var gulp              = require('gulp');
var sass              = require('gulp-sass');
var concat            = require('gulp-concat');
var rename            = require('gulp-rename');
var uglify            = require('gulp-uglify');
var postcss           = require('gulp-postcss');
var sourcemaps        = require('gulp-sourcemaps');
var autoprefixer      = require('gulp-autoprefixer');
var autoprefixer      = require('autoprefixer');
var requirejsOptimize = require('gulp-requirejs-optimize');
var gettext           = require('gulp-gettext');

function getPostCssProcessors() {
    return [
        autoprefixer({browsers: ['last 2 versions']}),
    ];
}

gulp.task('js:builder', function(){
    gulp.src('assets/js/builder/main.js')
    .pipe(sourcemaps.init())
    .pipe(requirejsOptimize(function(file) {
        return {
            name: '../lib/almond',
            optimize: 'uglify2',
            wrap: true,
            baseUrl: 'assets/js/builder/',
            include: ['main'],
            preserveLicenseComments: false
        };
    }))
    .pipe(rename('builder.js'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/js/min/'));
});

gulp.task('js:frontend', function(){

    gulp.src( 'assets/js/front-end/main.js' )
    .pipe(sourcemaps.init())
    .pipe(requirejsOptimize(function(file) {
        return {
            name: '../lib/almond',
            optimize: 'uglify2',
            wrap: true,
            baseUrl: 'assets/js/front-end/',
            include: ['main'],
            preserveLicenseComments: false
        };
    }))
    .pipe(rename('front-end.js'))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/js/min/'));

    gulp.src([
        'assets/js/lib/moment-with-locales.min.js',
        'assets/js/lib/pikaday.min.js',
        'assets/js/lib/pikaday-responsive.min.js'
    ])
    .pipe(concat('front-end--datepicker.min.js'))
    .pipe(gulp.dest('assets/js/min/'));

    gulp.src([
        'assets/js/lib/jquery.maskedinput.min.js',
    ])
        .pipe(concat('front-end--inputmask.min.js'))
        .pipe(gulp.dest('assets/js/min/'));

    gulp.src([
        'assets/js/lib/bootstrap.min.js',
        'assets/js/lib/codemirror.min.js',
        'assets/js/lib/codemirror-xml.min.js',
        'assets/js/lib/codemirror-formatting.min.js',
        'assets/js/lib/summernote.min.js'
    ])
    .pipe(concat('front-end--rte.min.js'))
    .pipe(gulp.dest('assets/js/min/'));

    gulp.src([
        'assets/js/lib/rating.min.js'
    ])
    .pipe(concat('front-end--starrating.min.js'))
    .pipe(gulp.dest('assets/js/min/'));

    gulp.src([
        'assets/js/lib/jBox.min.js'
    ])
        .pipe(concat('front-end--helptext.min.js'))
        .pipe(gulp.dest('assets/js/min/'));

    gulp.src([
        'assets/js/lib/backbone.marionette.min.js',
        'assets/js/lib/backbone.radio.min.js',
        'assets/js/lib/math.min.js',
        'assets/js/lib/modernizr.min.js',
        'assets/js/min/global.js',
    ])
    .pipe(concat('front-end-deps.js'))
    .pipe(gulp.dest('assets/js/min/'));
});

gulp.task('css:builder', function(){
    gulp.src('assets/scss/admin/builder.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(getPostCssProcessors()))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('css:display-structure', function(){
    gulp.src('assets/scss/front-end/display-structure.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(getPostCssProcessors()))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('css:display-opinions', function(){
    gulp.src('assets/scss/front-end/display-opinions.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(getPostCssProcessors()))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('css:display-opinions-light', function(){
    gulp.src('assets/scss/front-end/display-opinions-light.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(getPostCssProcessors()))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('css:display-opinions-dark', function(){
    gulp.src('assets/scss/front-end/display-opinions-dark.scss')
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss(getPostCssProcessors()))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('assets/css'));
});

gulp.task('gettext', function() {
    gulp.src('lang/*.po')
    .pipe(gettext())
    .pipe(gulp.dest('lang'))
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('assets/js/builder/**/*.js', ['js:builder']);
    gulp.watch('assets/js/front-end/**/*.js', ['js:frontend']);

    gulp.watch('assets/scss/**/*.scss', ['css']);
});

gulp.task('js', ['js:builder', 'js:frontend']);
gulp.task('css', [ 'css:builder', 'css:display-structure', 'css:display-opinions', 'css:display-opinions-light', 'css:display-opinions-dark']);

gulp.task('build', ['js', 'css']);
// Default Task
gulp.task('default', ['build', 'watch']);
