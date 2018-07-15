const gulp       = require('gulp');
const typescript = require('gulp-typescript');
const sass       = require('gulp-sass');
const tscConfig  = require('./tsconfig.json');

gulp.task('ts', function () {
    return gulp
        .src('src/**/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist'));
});

gulp.task('scss', function() {
    return gulp.src('src/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));
});

gulp.task('cof', function() {
    return gulp
        .src(['src/**/*','!src/**/*.ts','!src/**/*.scss'])
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['compile', 'watch']);

gulp.task('compile', ['scss','cof','ts']);

gulp.task('watch', function(cb) {
    gulp.watch('src/**/*.ts', ['ts']);
    gulp.watch('src/**/*.scss', ['scss']);
    gulp.watch(['src/**/*','!src/**/*.ts','!src/**/*.scss'], ['cof']);
});