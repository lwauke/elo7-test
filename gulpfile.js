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

const htmlPath = 'src/*.pug';
const cssPath = 'src/stylesheets/**/*.scss';
const jsPath = 'src/javascripts/**/*.js';
const imgPath = 'src/images/*';

const path = require('path');
const fse = require('fs-extra');

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
      presets: ['@babel/preset-env'],
      plugins: ['@babel/transform-runtime']
    }));
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
  watch(htmlPath, html);
  watch(cssPath, css);
  watch(jsPath, js);
  watch(imgPath, img)
});

task('build', series(
  clean,
  parallel(html, css, js, img)
));