const gulp = require('gulp');
const sass = require('gulp-sass');
const pleeease = require('gulp-pleeease');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./webpack.config.js');
const replace = require('gulp-replace');
const crypto = require('crypto');
const fs = require('fs');

gulp.task('sass', function () {
    gulp.src('scss/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(pleeease())
    .pipe(gulp.dest('public'));
});

gulp.task('js', cb => {
    const webpackBundler = webpack(webpackConfig);
    return gulp.src('js/main.js')
        .pipe(webpackBundler)
        .on('error', err => cb())
        .pipe(gulp.dest('public/'));
});

gulp.task('html', function () {
    gulp.src('html/index.html')
        .pipe(replace('##js_hash##', crypto.createHash('md5').update(fs.readFileSync('public/main.js')).digest('hex').substring(0, 6)))
        .pipe(replace('##css_hash##', crypto.createHash('md5').update(fs.readFileSync('public/main.css')).digest('hex').substring(0, 6)))
        .pipe(gulp.dest('public'));
});

gulp.task('sass:watch', ['sass'], () => {
    gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('js:watch', ['js'], () => {
    gulp.watch('js/**/*.js', ['js']);
});

gulp.task('html:watch', ['html'], () => {
    // gulp.watch('public/**/*.{js,css}', ['html']);
    // gulp.watch('html/**/*.html', ['html']);

    gulp.watch(['html/**/*.html', 'public/**/*.{js,css}'], ['html']);


});

gulp.task('dev', ['sass:watch', 'js:watch', 'html:watch'], () => {
    browserSync.init({
        files: './public/*',
        open: false,
        server: {
            baseDir: './public',
            port: 3000,
            middleware: function(req, res, next) {
                // if (!req.url.includes('browser-sync-client') && !req.url.includes('.css') && !req.url.includes('.js')) {
                if (!/(\.js|\.css|\.jpg|browser-sync-client)/.test(req.url)) {
                    req.url = '/';
                }

                return next();
                // var url = require('url');
                // var fs = require('fs');
                // var fileName = url.parse(req.url);
                // fileName = fileName.href.split(fileName.search).join("");
                // var fileExists = fs.existsSync(folder + fileName);
                // if (!fileExists && fileName.indexOf("browser-sync-client") < 0) {
                //     req.url = "/";
                // }
                // return next();
            }
        }
    });

    gulp.watch("public/*").on('change', browserSync.reload);
});
