/* eslint-disable @typescript-eslint/promise-function-async */
const gulp = require(`gulp`);
const del = require('del');

exports[`clean-dist`] = function removeIndexHtml () {
  return del([
    `./dist`,
  ]);
};

exports[`extract-non-static`] = gulp.series(
  function extractNonStatic () {
    return gulp.src([
      `./dist/static/index.html`,
    ])
      .pipe(gulp.dest(`./dist`));
  },
  function removeNonStatic () {
    return del([
      `./dist/static/index.html`,
    ]);
  },
);
