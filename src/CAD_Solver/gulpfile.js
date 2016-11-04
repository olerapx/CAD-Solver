/// <binding BeforeBuild='build' ProjectOpened='watch' />
var gulp = require('gulp'),
    pug = require('gulp-pug'),
    stylus = require('gulp-stylus'),
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    poststylus = require('poststylus'),
    csso = require('gulp-csso'), // css min
    imagemin = require('gulp-imagemin'), // img min
    uglify = require('gulp-uglify'), // js min
    serveStatic = require('serve-static'),
    rename = require('gulp-rename'),
    plumber = require('gulp-plumber'), //error handler
    sequence = require('gulp-sequence'),
    babel = require('gulp-babel');

var paths = {
    webroot: "./wwwroot"
};
paths.src =  './Assets';

paths.imgSrc = paths.src + '/img/**/*';
paths.jsSrc = paths.src + '/js/**/*.js';
paths.stylusSrc = paths.src + '/stylus/**/*.styl';
paths.templateSrc = paths.src + '/template/**/*.pug';
paths.templateSharedSrc = paths.src + '/template/_Layout.pug';

paths.libsSrcDir = './node_modules';

paths.libsSrc = {
    "jquery": '/jquery/**/*.{js,map}',
    "bootstrap": '/bootstrap/**/*.{js,map,css,ttf,svg,woff,eot}',
    "chart.js": '/chart.js/**/*.{js,map}'
};
paths.bootstrapThemeSrc = paths.src + '/bootstrap_theme/**/*';

paths.imgDest = paths.webroot + '/img';
paths.jsDest = paths.webroot + '/js';
paths.cssDest = paths.webroot + '/css';
paths.libsDest = paths.webroot + '/lib';
paths.bootstrapThemeDest = paths.libsDest + '/bootstrap/dist/css';

paths.views = "./Views";
paths.htmlSharedDest = paths.views + "/Shared";
paths.htmlHomeDest = paths.views + "/Home";

gulp.task('img', () => {
    return gulp.src(paths.imgSrc)
        .pipe(plumber())
       .pipe(imagemin())
       .pipe(gulp.dest(paths.imgDest));
});

gulp.task('js', () => {
    return gulp.src(paths.jsSrc)
        .pipe(plumber())
        .pipe(gulp.dest(paths.jsDest));
});

gulp.task('js:rel', () => {
    return gulp.src(paths.jsSrc)
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.jsDest));
});

gulp.task('css', () => {
    return gulp.src(paths.stylusSrc)
        .pipe(plumber())
        .pipe(stylus({
            use: [
                poststylus(['autoprefixer'])
            ]
        }))
        .pipe(gulp.dest(paths.cssDest));
});

gulp.task('css:rel', () => {
    return gulp.src(paths.stylusSrc)
        .pipe(plumber())
        .pipe(stylus({
            use: [
                poststylus(['autoprefixer'])
            ]
        }))
        .pipe(csso())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.cssDest));
});

gulp.task('html', () => {
    return gulp.src([paths.templateSrc, '!' + paths.templateSharedSrc])
        .pipe(plumber())
         .pipe(pug({
             pretty: true
         }))
         .pipe(rename({ extname: '.cshtml' }))
        .pipe(gulp.dest(paths.htmlHomeDest));        
});

gulp.task('html:shared', () => {
    return gulp.src(paths.templateSharedSrc)
        .pipe(plumber())
         .pipe(pug({
             pretty: true
         }))
         .pipe(rename({ extname: '.cshtml' }))
        .pipe(gulp.dest(paths.htmlSharedDest));
});

gulp.task('libs', () => {
    for (var dir in paths.libsSrc) {
        gulp.src(paths.libsSrcDir + paths.libsSrc[dir])
            .pipe(gulp.dest(paths.libsDest + '/' + dir));
    }
});

gulp.task('bootstrap:theme', () => {
    gulp.src(paths.bootstrapThemeSrc)
        .pipe(gulp.dest(paths.bootstrapThemeDest));
});

gulp.task('build', sequence(['img', 'js', 'js:rel', 'css', 'css:rel', 'html', 'html:shared', 'libs'], ['bootstrap:theme']));

gulp.task('watch', function () {
    gulp.run('build');

    gulp.watch(paths.imgSrc, ['img']);
    gulp.watch(paths.jsSrc, ['js', 'js:rel']);
    gulp.watch(paths.stylusSrc, ['css', 'css:rel']);
    gulp.watch(paths.templateSrc, ['html', 'html:shared']);
});
