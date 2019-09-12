const { src, dest, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCss = require('gulp-csso');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
 
sass.compiler = require('node-sass');

const htmlPath = 'src/templates/*.pug';
const cssPath = 'src/stylesheets/**/*.scss';
const jsPath = 'src/javascripts/**/*.js';

function html() {
  return src(htmlPath)
    .pipe(pug())
    .pipe(dest('dist'));
}

function css() {
  return src(cssPath)
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(dest('dist/stylesheets'));
}

function js() { 
  return src(jsPath)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest('dist/javascripts'));
}

function watchFiles() {
  watch(htmlPath, html);
  watch(cssPath, css);
  watch(jsPath, js);
}

async function build() {
  html();
  css();
  js();
}

exports.watch = watchFiles;
exports.build = build;