'use strict';

const gulp        = require('gulp');
const imagemin    = require('gulp-imagemin');
const pug         = require('gulp-pug');
const uglify      = require('gulp-uglify');
const cssnano     = require('gulp-cssnano');
const concatJs    = require('gulp-concat');
const concatCss   = require('gulp-concat-css');
const del         = require('del');
const pngquant    = require('imagemin-pngquant');
const browserSync = require('browser-sync');

['pug', 'css', 'js', 'fonts', 'imagemin'].forEach(taskName => gulp.task(`${taskName}-watch`, [taskName], done => {
  browserSync.reload();
  done();
}));

gulp.task('clean', () => {
   return del.sync('./dist');
});

gulp.task('pug', () => {
  return gulp.src('./src/views/pages/*.pug')
  	.pipe(pug())
  	.pipe(gulp.dest('./dist/'));
});

gulp.task('css', () => {
  return gulp.src(['./src/styles/vendor/*.css', './src/styles/*.css'])
    .pipe(concatCss('styles.css'))
    .pipe(cssnano())
    .pipe(gulp.dest('./dist/styles/'));
});

gulp.task('js', () => {
  return gulp.src(['./src/scripts/vendor/*.js', './src/scripts/*.js'])
    .pipe(concatJs('scripts.js'))
    .pipe(uglify())
    .pipe(gulp.dest('./dist/scripts/'));
});

gulp.task('imagemin', () => {
  return gulp.src('src/images/*')
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{removeViewBox: false}],
      use: [pngquant()]
    }))
    .pipe(gulp.dest('dist/images'));
});

gulp.task('fonts', () => {
  return gulp.src('./src/fonts/**/*')
    .pipe(gulp.dest('./dist/fonts/'));
});

gulp.task('watch', () => {
  gulp.watch('./src/views/**/*', ['pug-watch']);
  gulp.watch('./src/scripts/**/*', ['js-watch']);
  gulp.watch('./src/styles/**/*', ['css-watch']);
  gulp.watch('./src/fonts/**/*', ['fonts-watch']);
  gulp.watch('./src/images/*', ['imagemin-watch']);
});

gulp.task('reload', () => {
  browserSync.reload();
});

gulp.task('serve', () => {
  browserSync({
    server: './dist',
    baseDir: '/',
    port: 4000,
    notify: false
  });
});

gulp.task('build', ['clean', 'imagemin', 'pug', 'css', 'js', 'fonts']);

gulp.task('default', ['build', 'watch'], () => {
  gulp.run('serve');
});
