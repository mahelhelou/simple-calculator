const gulp = require('gulp')

const pug = require('gulp-pug')

const sass = require('gulp-sass')
const autoprefixer = require('gulp-autoprefixer')
const sourcemaps = require('gulp-sourcemaps')

const concat = require('gulp-concat')

const imageMin = require('gulp-image')
const minifyCSS = require('gulp-csso')
const uglify = require('gulp-uglify')
const del = require('del')

const browserSync = require('browser-sync').create()

function html() {
  return gulp.src('./app/assets/pug/**/*.pug')
    .pipe(pug({
      pretty: true
    }))
    .pipe(gulp.dest('./app'))
}

function styles() {
  return gulp.src('./app/assets/styles/styles.scss')
    // .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: 'expanded' })).on('error', sass.logError)
    .pipe(autoprefixer('last 2 versions'))
    // .pipe(minifyCSS())
    // .pipe(sourcemaps.write())
    .pipe(gulp.dest('./app/temp/styles'))
    .pipe(browserSync.stream())
}

function scripts() {
  return gulp.src('./app/assets/scripts/**/*.js', { sourcemaps: false })
    .pipe(concat('app.min.js'))
    .pipe(gulp.dest('./app/temp/scripts', { sourcemaps: false }))
}

function watch() {
  browserSync.init({
    notify: false,
    server: {
      baseDir: 'app'
    }
  })
  gulp.watch('./app/assets/pug/**/*.pug', html)
  gulp.watch('./app/assets/styles/**/*.scss', styles)
  gulp.watch('./app/assets/scripts/**/*.js', scripts)

  gulp.watch('./app/*.html').on('change', browserSync.reload)
  gulp.watch('./app/assets/scripts/**/*.js').on('change', browserSync.reload)
}

function deleteDistFolder() {
  return del('./dist')
}

function compressImages() {
  return gulp.src(['./app/assets/images/**/*', '!./app/assets/images/icons', '!./app/assets/images/icons/**/*'])
    .pipe(imageMin())
    .pipe(gulp.dest('./dist/assets/images'))
}

function build() {
  deleteDistFolder()
  compressImages()
}

exports.html = html
exports.styles = styles
exports.scripts = scripts
exports.watch = watch

exports.deleteDistFolder = deleteDistFolder
exports.compressImages = compressImages
exports.build = build

// exports.default = gulp.parallel(html, styles, scripts, watch)