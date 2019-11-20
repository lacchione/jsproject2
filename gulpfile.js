const {src, dest, watch, parallel, series} = require('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const del = require('delete');
const md = require('gulp-markdown');
const wrap = require('gulp-wrap');
const frontMatter = require('gulp-front-matter');
const terser = require('gulp-terser');
const concat = require('gulp-concat');  
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const fs = require ('fs');


function markdown() {
    return src('source/pages/**/*.md')
      .pipe(frontMatter())
      .pipe(md())
      .pipe(wrap( 
        data => fs.readFileSync('source/templates/' + data.file.frontMatter.template + '.html').toString(), 
        null, 
        {engine: 'nunjucks'}))
      .pipe(dest('prod/'));
  }
  exports.markdown = markdown;
  
  function image() {
    return src(['source/images/*.jpg', 'source/images/*.png', 'source/images/*.mp4']).pipe(dest('prod/images/'));
}

  function layout() {

    return src('source/templates/*.html');
}

function css(){

    return src('source/scss/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('prod/ui/'));
}  
exports.css = css; 

function js() {
    return src(['source/js/*.js', 'source/js/*.ts'])
        .pipe(sourcemaps.init())
        .pipe(typescript({target: 'ES6', allowJs: true}))
        .pipe(concat('main.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('prod/ui/'));
}

function watch_task() {

  watch('source/scss/*.scss', series(css,reload));
  watch('source/pages/*.md', series(markdown,reload));
  watch(['source/images/*.jpg', 'source/images/*.png'], series(image, reload));
  watch(['source/js/*.js', 'source/js/*.ts'], series(js,reload));
  watch('source/templates/*.html', series(layout, reload));
}
exports.watch = watch_task;


function sync(cb) {

  browserSync.init({
      server: {baseDir: 'prod/'}
  });
  cb();
}

exports.sync= sync;

function reload(cb) {
  browserSync.reload();
  cb();
}

function clean(cb) {

  del(['prod/'], cb);
}
exports.clean = clean;

exports.default = series(clean, parallel(markdown, image, js, css), sync, watch_task);