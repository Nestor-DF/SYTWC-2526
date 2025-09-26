// gulpfile.mjs (Gulp 4, ESM)
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
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import gulpSass from 'gulp-sass';
import dartSass from 'sass';
const sass = gulpSass(dartSass);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

// ---------- Scaffold ----------
function scaffold(cb) {
    const dirs = ['src', 'src/css', 'src/scss', 'src/js', 'src/images', 'dist'];
    dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

    const htmlPath = path.join(__dirname, 'src', 'index.html');
    if (!fs.existsSync(htmlPath)) {
        fs.writeFileSync(htmlPath, `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Práctica Gulp</title>
  <link rel="stylesheet" href="./assets/css/app.min.css">
</head>
<body>
  <h1>¡Hola Gulp!</h1>
  <p>CSS concatenado y minificado, JS minificado, imágenes optimizadas y sourcemaps.</p>
  <img src="./assets/images/demo1.jpg" alt="demo1" width="300">
  <img src="./assets/images/demo2.png" alt="demo2" width="300">
  <script src="./assets/js/app.min.js"></script>
</body>
</html>`);
    }

    const css1 = path.join(__dirname, 'src', 'css', 'base.css');
    if (!fs.existsSync(css1)) {
        fs.writeFileSync(css1, `/* base.css */
:root { --color: #0d6efd; }
body { font-family: system-ui, sans-serif; margin: 0; padding: 2rem; }
h1 { color: var(--color); }`);
    }

    const css2 = path.join(__dirname, 'src', 'css', 'layout.css');
    if (!fs.existsSync(css2)) {
        fs.writeFileSync(css2, `/* layout.css */
p { line-height: 1.6; max-width: 60ch; }
img { margin-right: 1rem; border-radius: .5rem; }`);
    }

    const scssPath = path.join(__dirname, 'src', 'scss', 'styles.scss');
    if (!fs.existsSync(scssPath)) {
        fs.writeFileSync(scssPath, `// styles.scss
$accent: #ff6b6b;
.button {
  background: $accent;
  color: #fff;
  padding: .6rem 1rem;
  border-radius: .5rem;
  &:hover { opacity: .9; }
}`);
    }

    const js1 = path.join(__dirname, 'src', 'js', 'main.js');
    if (!fs.existsSync(js1)) fs.writeFileSync(js1, `// main.js
console.log('Main JS cargado');`);

    const js2 = path.join(__dirname, 'src', 'js', 'utils.js');
    if (!fs.existsSync(js2)) fs.writeFileSync(js2, `// utils.js
export function saluda(nombre){ return \`Hola, \${nombre}!\`; }`);

    const img1 = path.join(__dirname, 'src', 'images', 'demo1.jpg');
    const img2 = path.join(__dirname, 'src', 'images', 'demo2.png');
    if (!fs.existsSync(img1)) fs.writeFileSync(img1, '');
    if (!fs.existsSync(img2)) fs.writeFileSync(img2, '');

    cb();
}

// ---------- Limpieza ----------
function clean() {
    return deleteAsync([paths.dist]);
}

// ---------- HTML ----------
function html() {
    return src(paths.html).pipe(dest(paths.dist)).pipe(browserSync.stream());
}

// ---------- CSS ----------
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

// ---------- JS ----------
function scripts() {
    return src(paths.js, { allowEmpty: true })
        .pipe(sourcemaps.init())
        .pipe(concat('app.min.js'))
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest(paths.distJS))
        .pipe(browserSync.stream());
}

// ---------- Imágenes ----------
function images() {
    return src(paths.images, { allowEmpty: true })
        .pipe(
            imagemin([
                mozjpeg({ quality: 78 }),
                pngquant({ quality: [0.7, 0.85] }),
                gifsicle({ optimizationLevel: 2 }),
                svgo()
            ])
        )
        .pipe(dest(paths.distIMG))
        .pipe(browserSync.stream());
}

// ---------- Servidor y Watch ----------
const browserSync = browserSyncLib.create();
function serve() {
    browserSync.init({ server: { baseDir: paths.dist }, open: false });
    watch(paths.html, html);
    watch([paths.scss, paths.css], styles);
    watch(paths.js, scripts);
    watch(paths.images, images);
}

export const build = series(clean, parallel(html, styles, scripts, images));

export { scaffold, clean, html, styles, scripts, images };
export const serveTask = series(build, serve);
export default series(build, serve);   // `gulp` => build + server + watch
