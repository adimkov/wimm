var gulp = require('gulp');
var ts = require('gulp-typescript');
var sourcemaps = require('gulp-sourcemaps');
var clean = require('gulp-clean');
var concatCss = require('gulp-concat-css');
var less = require('gulp-less');
var path = require('path');
var exec = require('gulp-exec');
var gulpSequence = require('gulp-sequence');
var gncd = require('gulp-npm-copy-deps');

var tsProject = ts.createProject('tsconfig.json');

gulp.task('script', function() {
    return tsProject.src()
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(tsProject()).js
    .pipe(sourcemaps.write({ includeContent: false, sourceRoot: '../src', destPath:'./dist'}))
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-html', function() {
    return gulp.src('./src/**/*.html')
    .pipe(gulp.dest('./dist'));
});

gulp.task('src-assets-styles', function() {
    return gulp.src('./src/assets/**/*.less')
    .pipe(less(
        {
            paths: [ path.join(__dirname, './src/assets/') ]
        }
    ))
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('src-assets-img', function() {
    return  gulp.src('./src/assets/**/*.+(png|ico)')
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('src-assets', ['src-assets-styles', 'src-assets-img'])

gulp.task('copy-assets', function() {
    return gulp.src([
        './bower_components/**/*.+(min.css|otf|eot|svg|ttf|woff|woff2)', 
        './node_modules/chartist/dist/*.+(min.css|otf|eot|svg|ttf|woff|woff2)',
        './node_modules/chartist-plugin-tooltips/dist/*.+(css|otf|eot|svg|ttf|woff|woff2)'])
    .pipe(gulp.dest('./dist/assets'));
});

gulp.task('copy-npm-modules', function() {
    return gncd('.', './dist');
});

gulp.task('copy-npm-desc', function() {
     return gulp.src('package.json')
     .pipe(gulp.dest('./dist'));
});

gulp.task('copy-npm', ['copy-npm-modules', 'copy-npm-desc']);

gulp.task('clean', function() {
    return gulp.src(['./dist', './publish'])
        .pipe(clean());
});

gulp.task('build-publish-win', function() {
    return gulp.src('/')
        .pipe(exec('electron-packager ./dist --out=./publish --platform=win32 --asar --overwrite --icon=./dist/assets/logo-win.ico'))
        .pipe(exec.reporter());
});

gulp.task('build-publish-linux', function() {
    return gulp.src('/')
        .pipe(exec('electron-packager ./dist --out=./publish --platform=linux --asar --overwrite --icon=./dist/assets/logo.png'))
        .pipe(exec.reporter());
});


gulp.task('build-publish-darwin', function() {
    return gulp.src('/')
        .pipe(exec('electron-packager ./dist --out=./publish --platform=darwin --asar --overwrite --icon=./dist/assets/logo.png'))
        .pipe(exec.reporter());
});

gulp.task('build', ['script', 'copy-html', 'src-assets']);

gulp.task('rebuild', ['script', 'copy-html', 'src-assets', 'copy-assets', 'copy-npm']);

gulp.task('publish', gulpSequence('clean', 'rebuild', 'build-publish-win', 'build-publish-linux'));
