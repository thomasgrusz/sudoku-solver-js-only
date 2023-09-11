const gulp = require('gulp');
const htmlmin = require('gulp-htmlmin');
const terser = require('gulp-terser');
const rename = require('gulp-rename');
const del = require('del');

// Clean the "dist" folder
function clean() {
  return del(['dist']);
}

// Minify HTML files
function minifyHTML() {
  return gulp.src('src/index.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('dist'));
}

// Minify JS files
function minifyJS() {
  return gulp.src('src/js/*.js')
    .pipe(terser())
    // .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('dist/js'));
}

// Watch for changes (optional)
function watch() {
  gulp.watch('src/index.html', minifyHTML);
  gulp.watch('src/js/*.js', minifyJS);
}

// Define a default task
exports.default = gulp.series(
  clean,
  gulp.parallel(minifyHTML, minifyJS),
  watch
);

exports.clean = clean;
exports.minifyHTML = minifyHTML;
exports.minifyJS = minifyJS;