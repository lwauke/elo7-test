const { src, dest, watch } = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const minifyCss = require('gulp-csso');
const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
 
sass.compiler = require('node-sass');

function html() {
  return src('src/**/*.pug')
    .pipe(pug())
    .pipe(dest('dist'))
}

function css() {
  return src('src/stylesheets/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(minifyCss())
    .pipe(dest('dist/stylesheets'))
}

function js() { 
  return src('src/javascripts/**/*.js')
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(dest('dist/javascripts'))
}

function watchFiles() {
  watch('src/stylesheets/**/*.scss', css);
  watch('src/javascripts/**/*.js', js);
  watch('src/**/*.pug', html);
}

exports.watch = watchFiles;