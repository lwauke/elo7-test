const { src, dest, watch, parallel } = require('gulp');

const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCss = require('gulp-csso');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');

const htmlPath = 'src/templates/*.pug';
const cssPath = 'src/stylesheets/**/*.scss';
const jsPath = 'src/javascripts/**/*.js';

sass.compiler = require('node-sass');

const onProd = (stream, ...tasks) =>
  process.env.NODE_ENV === 'production'
    ? tasks.reduce((s, task) => s.pipe(task()), stream)
    : stream;

function html() {
  return src(htmlPath)
    .pipe(pug())
    .pipe(dest('dist'));
}

function css() {
  let stream = src(cssPath)
    .pipe(sass().on('error', sass.logError));
    
  return onProd(stream, minifyCss)
    .pipe(dest('dist/stylesheets'));  
}

function js() {
  let stream = src(jsPath)
    .pipe(babel({
      presets: ['@babel/env']
    }));

  return onProd(stream, uglify)
    .pipe(dest('dist/javascripts'));
}

function watchFiles() {
  watch(htmlPath, html);
  watch(cssPath, css);
  watch(jsPath, js);
}

async function build() {
  parallel(html, css, js);
}

exports.watch = watchFiles;
exports.build = build;