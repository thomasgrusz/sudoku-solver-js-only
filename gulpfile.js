const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const rename = require("gulp-rename");
const del = require("del");
const babel = require("gulp-babel");

// Clean the "docs" folder
function clean() {
  return del(["docs"]);
}

// Minify HTML files
function minifyHTML() {
  return gulp
    .src("src/index.html")
    .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
    .pipe(gulp.dest("docs"));
}

// // Minify JS files
// function minifyJS() {
//   return (
//     gulp
//       .src("src/js/*.js")
//       .pipe(terser())
//       // .pipe(rename({ suffix: '.min' }))
//       .pipe(gulp.dest("docs/js"))
//   );
// }

// Transpile and Minify JS files using Babel
function transpileJS() {
  return gulp
    .src("src/js/*.js")
    .pipe(
      babel({
        presets: ["@babel/preset-env"],
      })
    )
    .pipe(terser())
    .pipe(gulp.dest("docs/js"));
}

// Copy contents of 'static' folder to 'docs'
function copyStatic() {
  return gulp
    .src("src/static/**/*", { dot: true }) // '**/*' selects all files and subdirectories
    .pipe(gulp.dest("docs"));
}

// Watch for changes (optional)
function watch() {
  gulp.watch("src/index.html", minifyHTML);
  // gulp.watch("src/js/*.js", minifyJS);
  gulp.watch("src/js/*.js", transpileJS);
  gulp.watch("static/**/*", copyStatic);
}

// Define a default task
exports.default = gulp.series(
  clean,
  // gulp.parallel(minifyHTML, minifyJS, copyStatic),
  gulp.parallel(minifyHTML, transpileJS, copyStatic),
  watch
);

exports.clean = clean;
exports.minifyHTML = minifyHTML;
// exports.minifyJS = minifyJS;
exports.transpileJS = transpileJS;
exports.copyStatic = copyStatic;
