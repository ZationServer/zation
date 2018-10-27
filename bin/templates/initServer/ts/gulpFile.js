const gulp       = require('gulp');
const typescript = require('gulp-typescript');
const tscConfig  = require('./tsconfig.json');

gulp.task('ts', function () {
    return gulp
        .src('src/**/*.ts')
        .pipe(typescript(tscConfig.compilerOptions))
        .pipe(gulp.dest('dist'));
});

gulp.task('cof', function() {
    return gulp
        .src(['src/**/*','!src/**/*.ts',])
        .pipe(gulp.dest('dist'));
});

gulp.task('compile', gulp.parallel('cof','ts'));

gulp.task('watch', () =>
{
    gulp.watch('src/**/*.ts', gulp.parallel('ts'));
    gulp.watch(['src/**/*', '!src/**/*.ts'], gulp.parallel('cof'));
});

gulp.task('default', gulp.series('compile', 'watch'));
