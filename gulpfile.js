var lr = require('tiny-lr'), // livereload
    gulp = require('gulp'), 
    pug = require('gulp-pug'), 
    stylus = require('gulp-stylus'),
    livereload = require('gulp-livereload'), 
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    poststylus = require('poststylus'),
    csso = require('gulp-csso'), // css min
    imagemin = require('gulp-imagemin'), // img min
    uglify = require('gulp-uglify'), // js min
    connect = require('connect'), // webserver
    serveStatic = require('serve-static'),
    gulp = require('gulp'),
    babel = require('gulp-babel'),
    server = lr();

gulp.task('stylus', function() {
    gulp.src('./assets/stylus/**/*.styl')
        .pipe(stylus({
            use: [
                poststylus(['autoprefixer'])
            ]
        }))
        .on('error', console.log)
        .pipe(gulp.dest('./build/css/'))
        .pipe(livereload(server)); 
});

gulp.task('pug', function() {
    gulp.src(['./assets/template/**/*.pug', '!./assets/template/_*.pug'])
        .pipe(pug({
            pretty: true
        })) 
        .on('error', console.log)
        .pipe(gulp.dest('./build/'))
        .pipe(livereload(server));
}); 

gulp.task('js', function() {
    gulp.src('./assets/js/**/*.js')
        .pipe(gulp.dest('./build/js'))
        .pipe(livereload(server));
});

gulp.task('libs', function() {
    gulp.src('./assets/libs/**/*')
        .pipe(gulp.dest('./build/libs'))
        .pipe(livereload(server));
});

gulp.task('images', function() {
    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
        .pipe(livereload(server));
});

gulp.task('http-server', function() {
    connect()
        .use(require('connect-livereload')())
        .use(serveStatic('./public'))
        .listen('9000');

    console.log('Server listening on http://localhost:9000');
});

gulp.task('watch', function() {
    gulp.run('stylus');
    gulp.run('pug');
    gulp.run('js');
    gulp.run('libs');
    gulp.run('images');

    server.listen(35729, function(err) {
        if (err) return console.log(err);

        gulp.watch('./assets/stylus/**/*.styl', function() {
            gulp.run('stylus');
        });
        gulp.watch('./assets/template/**/*.pug', function() {
            gulp.run('pug');
        });
        gulp.watch('./assets/js/**/*.js', function() {
            gulp.run('js');
        }); 
        gulp.watch('./assets/libs/**/*', function() {
            gulp.run('libs');
        });
        gulp.watch('./assets/img/**/*', function() {
            gulp.run('images');
        });
    });
    gulp.run('http-server');
});

gulp.task('public', function() {

    gulp.src('./assets/stylus/**/*.styl')
        .pipe(stylus({
            use: [
                poststylus(['autoprefixer'])
            ]
        }))
        .on('error', console.log)
        .pipe(gulp.dest('./public/css/'))
        .pipe(livereload(server));


    gulp.src(['./assets/template/**/*.pug', '!./assets/template/_*.pug'])
        .pipe(pug({
            pretty: true
        })) 
        .on('error', console.log)
        .pipe(gulp.dest('./public/'));

    gulp.src('./assets/js/**/*.js')
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./public/js'));

    gulp.src('./assets/libs/**/*')
        .pipe(gulp.dest('./public/libs'));

    gulp.src('./assets/img/**/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/img'));
});