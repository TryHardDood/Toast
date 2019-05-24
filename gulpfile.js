const {src, dest, parallel} = require('gulp');
const concat = require('gulp-concat')
;
const cleanCSS = require('gulp-clean-css');
const sass = require('gulp-sass');

function css() {
    return src('app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('toast.min.css'))
        .pipe(cleanCSS())
        .pipe(dest('build/css'))
}

const uglifyes = require('uglify-es');
const composer = require('gulp-uglify/composer');
const uglify = composer(uglifyes, console);

function js() {
    return src('app/js/*.js', {sourcemaps: true})
        .pipe(uglify())
        .pipe(concat('toast.min.js'))
        .pipe(dest('build/js', {sourcemaps: true}))
}

exports.js = js;
exports.css = css;
exports.default = parallel(css, js);
