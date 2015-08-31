import gulp from 'gulp';
import del from 'del';
import sass from 'gulp-sass';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import inline from 'gulp-inline-source';
import cssnano from 'gulp-cssnano';
import uncss from 'gulp-uncss';
import autoprefixer from 'gulp-autoprefixer';
import minifyHTML from 'gulp-minify-html';

const bs = browserSync.create();

gulp.task('clean', cb => {
    del(['tmp', 'dist']).then(() => cb());
});

gulp.task('sass', () => {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass()).on('error', sass.logError)
        .pipe(uncss({
            html: ['src/index.html'],
            ignore: [/svg/]
        }))
        .pipe(autoprefixer())
        .pipe(cssnano())
        .pipe(gulp.dest('tmp/css'));
});

gulp.task('imagemin', () => {
    return gulp.src('src/svg/**/*.svg')
        .pipe(imagemin({
            multipass: true
        }))
        .pipe(gulp.dest('tmp/svg'));
});

gulp.task('inline', ['sass', 'imagemin'], () => {
    return gulp.src('src/index.html')
        .pipe(inline())
        .pipe(minifyHTML({
            comments: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['inline']);

gulp.task('serve', ['default'], () => {
    bs.init({
        server: './dist'
    });

    gulp.watch('src/scss/**/*.scss', ['inline']);
    gulp.watch('src/index.html', ['inline']);

    gulp.watch('dist/index.html').on('change', bs.reload);
});

