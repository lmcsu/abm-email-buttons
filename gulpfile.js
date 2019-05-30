const gulp        = require('gulp');
const gulpClean   = require('gulp-clean');
const uglifyJS    = require('uglify-js');
const postcss = require('postcss');
const autoPrefixer = require('autoprefixer');
const cssNano = require('cssnano');
const gulpFileInclude = require('gulp-file-include');
const gulpRename = require('gulp-rename');
const browserSync = require('browser-sync').create();

const rollup = require('rollup');
const rollupBabel = require('rollup-plugin-babel');
const rollupScss = require('rollup-plugin-scss');
const rollupImage = require('rollup-plugin-img');
const rollupNodeResolve = require('rollup-plugin-node-resolve');
const rollupCommonJS = require('rollup-plugin-commonjs');

const packageInfo = require('./package.json');

const MODE_DEVELOPMENT = 'development';
const MODE_PRODUCTION = 'production';
let MODE = MODE_PRODUCTION;

let style = '';
let script = '';

gulp.task('html', () =>
    gulp.src('./src/' + MODE + '.tpl')
        .pipe(gulpFileInclude({
            prefix: '{{',
            suffix: '}}',
            context: {
                name: packageInfo.name,
                version: packageInfo.version,
                repository: packageInfo.repository.url,
                style: style,
                script: script,
            },
        }))
        .pipe(gulpRename('index.html'))
        .pipe(gulp.dest('./build/'))
);

gulp.task('js', (done) => {
    const stylePromises = [];
    style = '';
    script = '';

    rollup.rollup({
        input: './src/script.js',
        plugins: [
            rollupBabel({
                presets: [
                    '@babel/env',
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    'babel-plugin-loop-optimizer',
                ],
            }),
            rollupNodeResolve(),
            rollupCommonJS(),
            rollupScss({
                output: (gen) => {
                    gen = gen || '';
                    stylePromises.push(new Promise((resolve, reject) => {
                        if (MODE === MODE_PRODUCTION) {
                            postcss([autoPrefixer, cssNano])
                                .process(gen, {
                                    from: undefined,
                                })
                                .then((result) => {
                                    style += result ? result.css : '';
                                    resolve();
                                })
                                .catch((e) => {
                                    reject(e.message);
                                });
                        } else {
                            style += gen;
                            resolve();
                        }
                    }));
                },
            }),
            rollupImage({
                limit: 50000,
            }),
        ],
    })
        .then((bundle) => {
            return bundle.generate({
                format: 'iife',
                name: 'script.js',
            });
        })
        .then((gen) => {
            let result = '';
            gen.output.forEach((obj) => {
                result += obj.code;
            });
            if (MODE === MODE_PRODUCTION) {
                result = uglifyJS.minify(result).code;
            }
            script = result;
        })
        .then(() => {
            Promise.all(stylePromises)
                .then(() => {
                    done();
                })
        })
        .catch((e) => {
            console.error(e.message);
            done();
        })
});

gulp.task('flush', () =>
    gulp.src([
        './build/*',
    ], {
        read: false,
        allowEmpty: true,
        dot: true,
    })
        .pipe(gulpClean())
);

gulp.task('build', gulp.series(
    gulp.parallel(
        'flush',
        'js',
    ),
    'html',
));

gulp.task('serve', (done) => {
    browserSync
        .init({
            notify: false,
            open: false,
            reloadDelay: 100,
            files: [
                './build/**/*',
            ],
            server: {
                baseDir: './build/',
            },
        });

    gulp.watch([
        './src/**/*',
    ] , gulp.series('build'));

    done();
});

gulp.task('dev', gulp.series(
    (done) => {
        MODE = MODE_DEVELOPMENT;
        done();
    },
    'build',
    'serve',
));

gulp.task('default', gulp.series(
    'dev',
));
