const {
  src,
  dest,
  watch,
  parallel,
  series,
  task
 } = require('gulp');

const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCss = require('gulp-csso');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const imagemin = require('gulp-imagemin');
const webpack = require('webpack-stream');

const htmlPath = 'src/*.pug';
const cssPath = 'src/stylesheets/**/*.scss';
const jsPath = 'src/javascripts/**/*.js';
const imgPath = 'src/images/*';

const path = require('path');
const fse = require('fs-extra');

const browserSync = require('browser-sync').create();

sass.compiler = require('node-sass');

const onProd = (stream, ...tasks) =>
  process.env.NODE_ENV === 'production'
    ? tasks.reduce((s, task) => s.pipe(task()), stream)
    : stream;

async function html() {
  src(htmlPath)
    .pipe(pug())
    .pipe(dest('dist'));
}

function cssTranspile() {
  return src(cssPath)
    .pipe(sass().on('error', sass.logError));
}

async function css() {  
  onProd(cssTranspile(), minifyCss)
    .pipe(dest('dist/stylesheets'));  
}

function jsTranspile() {
  return src(jsPath)
    .pipe(babel({
      presets: ['@babel/env'],
      plugins: ['@babel/transform-runtime']
    }).on('error', console.error))
    .pipe(webpack({
      output: {
        filename: 'bundle.js'
      },
      mode: process.env.NODE_ENV
    }).on('error', console.error));
}

async function js() {  
  onProd(jsTranspile(), uglify)
    .pipe(dest('dist/javascripts'));
}

async function img() {
  src(imgPath)
    .pipe(imagemin())
    .pipe(dest('dist/images'));
}

async function clean() {
  try {
    await fse.emptyDir(path.join(__dirname, 'dist'));
  } catch (err) {
    console.error('Build error: ', err);
  }  
}

task('watch', () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })

  watch(htmlPath, html).on('change', browserSync.reload);
  watch(cssPath, css).on('change', browserSync.reload);
  watch(jsPath, js).on('change', browserSync.reload);
  watch(imgPath, img)
});

task('build', series(
  clean,
  parallel(html, css, js, img)
));