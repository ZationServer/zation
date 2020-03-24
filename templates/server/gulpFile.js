const {src,dest,series,parallel,watch: gulpWatch} = require('gulp');
const typescript = require('gulp-typescript');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');

const tscConfig = require('./tsconfig.json');
const outputFolder = 'dist';

function clean() {
    return del(outputFolder);
}

function compile() {
    return src('src/**/*.ts')
        .pipe(sourcemaps.init())
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(sourcemaps.write({includeContent: false, sourceRoot: '/src'}))
        .pipe(dest(outputFolder));
}

function copyAssets() {
    return src(['src/**/*','!src/**/*.ts',])
        .pipe(dest(outputFolder));
}

const build = series(clean,parallel(compile,copyAssets));

function watch() {
    gulpWatch('src/**/*', {events: 'unlink'}, build);
    gulpWatch('src/**/*.ts', {events: ['change','add']}, compile);
    gulpWatch(['src/**/*', '!src/**/*.ts'], {events: ['change','add']}, copyAssets);
}

module.exports = {
    clean,
    compile,
    copyAssets,
    build,
    watch,
    default: series(build,watch)
};