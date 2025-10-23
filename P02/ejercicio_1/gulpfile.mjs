import gulp from 'gulp';
const { src, dest, series, parallel, watch } = gulp;

import concat from 'gulp-concat';
import cleanCSS from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import mozjpeg from 'imagemin-mozjpeg';
import pngquant from 'imagemin-pngquant';
import gifsicle from 'imagemin-gifsicle';
import svgo from 'imagemin-svgo';
import browserSyncLib from 'browser-sync';
import { deleteAsync } from 'del';
import debug from 'gulp-debug';

import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
const sass = gulpSass(dartSass);

const paths = {
    html: 'src/**/*.html',
    css: 'src/css/**/*.css',
    scss: 'src/scss/**/*.scss',
    js: 'src/js/**/*.js',
    images: 'src/images/**/*.{png,jpg,jpeg,gif,svg}',
    dist: 'dist',
    distCSS: 'dist/assets/css',
    distJS: 'dist/assets/js',
    distIMG: 'dist/assets/images'
};

function clean() {
    return deleteAsync([paths.dist]);
}

function html() {
    return src(paths.html).pipe(dest(paths.dist)).pipe(browserSync.stream());
}

function styles() {
    return src([paths.scss, paths.css], { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('app.min.css'))
        .pipe(cleanCSS({ level: 2 }))
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.distCSS))
        .pipe(browserSync.stream());
}

function scripts() {
    return src(paths.js, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.distJS))
        .pipe(browserSync.stream());
}

function images() {
    return src(paths.images)
        .pipe(debug({ title: 'Imagen:' }))
        .pipe(imagemin([
            mozjpeg({ quality: 60, progressive: true }),
            pngquant({ quality: [0.45, 0.6], speed: 1 }),
            gifsicle({ optimizationLevel: 3 }),
            svgo()
        ], { verbose: false }))
        .pipe(dest(paths.distIMG))
        .pipe(browserSync.stream());
}

const browserSync = browserSyncLib.create();
function serve() {
    browserSync.init({ server: { baseDir: paths.dist }, open: false });
    watch(paths.html, html);
    watch([paths.scss, paths.css], styles);
    watch(paths.js, scripts);
    watch(paths.images, images);
}

export const build = series(clean, parallel(html, styles, scripts, images));

export { clean, html, styles, scripts, images };
export const serveTask = series(build, serve);
export default series(build, serve);

gulp.task('sass', styles);
gulp.task('minify-css', styles);
gulp.task('images', images);
gulp.task('js', scripts);
gulp.task('watch', serve);
gulp.task('default', series(build, serve));