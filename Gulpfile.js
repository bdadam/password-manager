const gulp = require('gulp');
const sass = require('gulp-sass');
const pleeease = require('gulp-pleeease');
const webpack = require('webpack-stream');
const browserSync = require('browser-sync').create();
const webpackConfig = require('./webpack.config.js');
const replace = require('gulp-replace');
const crypto = require('crypto');
const fs = require('fs');
const rename = require("gulp-rename");

gulp.task('sass', function () {
    const moduleImporter = require('node-sass-module-importer');

    gulp.src('scss/main.scss')
    .pipe(sass({
        // importer: moduleImporter
        importer: require('node-sass-import')
    }).on('error', sass.logError))
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
    return gulp.src('html/vaults.html')
        .pipe(replace('##js_hash##', crypto.createHash('md5').update(fs.readFileSync('public/main.js')).digest('hex').substring(0, 6)))
        .pipe(replace('##css_hash##', crypto.createHash('md5').update(fs.readFileSync('public/main.css')).digest('hex').substring(0, 6)))
        .pipe(rename('index.html'))
        // .pipe(gulp.dest('public/vaults'));
        .pipe(gulp.dest('public'));

    // gulp.src('html/home.html')
    //     .pipe(replace('##js_hash##', crypto.createHash('md5').update(fs.readFileSync('public/main.js')).digest('hex').substring(0, 6)))
    //     .pipe(replace('##css_hash##', crypto.createHash('md5').update(fs.readFileSync('public/main.css')).digest('hex').substring(0, 6)))
    //     .pipe(rename('index.html'))
    //     .pipe(gulp.dest('public'));

});

gulp.task('sass:watch', ['sass'], () => {
    gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('js:watch', ['js'], () => {
    gulp.watch('js/**/*.js', ['js']);
    gulp.watch('templates/**/*.html', ['js']);
});

gulp.task('html:watch', ['html'], () => {
    // gulp.watch('public/**/*.{js,css}', ['html']);
    // gulp.watch('html/**/*.html', ['html']);

    gulp.watch(['html/**/*.html', 'public/**/*.{js,css}'], ['html']);


});

gulp.task('dev', ['sass:watch', 'js:watch', 'html:watch'], () => {

    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpack = require('webpack');
    const webpackBundler = webpack(webpackConfig);

    // webpackBundler.plugin('done', function (stats) {
    //     if (stats.hasErrors() || stats.hasWarnings()) {
    //         return browserSync.sockets.emit('fullscreen:message', {
    //             title: "Webpack Error:",
    //             body:  stripAnsi(stats.toString()),
    //             timeout: 100000
    //         });
    //     }
    //     browserSync.reload();
    // });

    browserSync.init({
        files: './public/*',
        open: false,
        notify: false,
        server: {
            baseDir: './public',
            port: 3000,
            host: '0.0.0.0',
            middleware: [function(req, res, next) {
                if (!/(\.js|\.css|\.jpg|\.html|browser-sync-client)/.test(req.url)) {
                    req.url = '/';
                }

                return next();
            },
            // webpackDevMiddleware(webpackBundler, {
            //     publicPath: webpackConfig.output.publicPath,
            //     stats: { colors: false }
            // })
        ]
        }
    });

    gulp.watch("public/*").on('change', browserSync.reload);
});
