const { src, dest, parallel } = require('gulp');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');

function css() {
  return src('app/css/*.css')
    .pipe(concat('toast.min.css'))
    .pipe(cleanCSS())
    .pipe(dest('build/css'))
}

function js() {
  return src('app/js/*.js', { sourcemaps: true })
    .pipe(uglify())
	.pipe(concat('toast.min.js'))
    .pipe(dest('build/js', { sourcemaps: true }))
}

exports.js = js;
exports.css = css;
exports.default = parallel(css, js);
