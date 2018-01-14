var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var header = require('gulp-header');
var cleanCSS = require('gulp-clean-css');
var rename = require("gulp-rename");
//var uglify = require('gulp-uglify');
//var pkg = require('./package.json');

var gutil = require( 'gulp-util' );
var ftp = require( 'vinyl-ftp' );

var du = require('date-utils');

var replace = require("gulp-replace");

// Set the banner content
// var banner = ['/*!\n',
//     ' * Start Bootstrap - <%= pkg.title %> v<%= pkg.version %> (<%= pkg.homepage %>)\n',
//     ' * Copyright 2013-' + (new Date()).getFullYear(), ' <%= pkg.author %>\n',
//     ' * Licensed under <%= pkg.license.type %> (<%= pkg.license.url %>)\n',
//     ' */\n',
//     ''
// ].join('');

// Compile LESS files from /less into /css
gulp.task('less', function() {
    var dt = new Date();
    var formatted = dt.toFormat("YYYY/MM/DD HH24:MI:SS");

    return gulp.src('less/blog_css.less')
        .pipe(less())
        .pipe(replace(/__currenttime__/gm,formatted))
//        .pipe(header(banner, { pkg: pkg }))
        .pipe(gulp.dest('dist/css'))
        //  .pipe(browserSync.reload({
        //      stream: true
        //  }))
});

// Minify compiled CSS
gulp.task('minify-css', function() {
    return gulp.src('dist/css/blog_css.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/css'))
        // .pipe(browserSync.reload({
        //     stream: true
        // }))
});

// Minify JS
// gulp.task('minify-js', function() {
//     return gulp.src('js/clean-blog.js')
//         .pipe(uglify())
//         .pipe(header(banner, { pkg: pkg }))
//         .pipe(rename({ suffix: '.min' }))
//         .pipe(gulp.dest('js'))
//         .pipe(browserSync.reload({
//             stream: true
//         }))
// });

// Copy vendor libraries from /node_modules into /vendor
// gulp.task('copy', function() {
//     gulp.src(['node_modules/bootstrap/dist/**/*', '!**/npm.js', '!**/bootstrap-theme.*', '!**/*.map'])
//         .pipe(gulp.dest('vendor/bootstrap'))
//
//     gulp.src(['node_modules/jquery/dist/jquery.js', 'node_modules/jquery/dist/jquery.min.js'])
//         .pipe(gulp.dest('vendor/jquery'))
//
//     gulp.src([
//             'node_modules/font-awesome/**',
//             '!node_modules/font-awesome/**/*.map',
//             '!node_modules/font-awesome/.npmignore',
//             '!node_modules/font-awesome/*.txt',
//             '!node_modules/font-awesome/*.md',
//             '!node_modules/font-awesome/*.json'
//         ])
//         .pipe(gulp.dest('vendor/font-awesome'))
// })

// Run everything
gulp.task('default', ['less', 'minify-css']);
//gulp.task('default', ['less', 'minify-css', 'minify-js', 'copy']);

// Configure the browserSync task
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: ''
        },
    })
})

// Dev task with browserSync
gulp.task('dev', ['less', 'minify-css', 'copy'], function() {
  //gulp.task('dev', ['browserSync', 'less', 'minify-css', 'minify-js'], function() {
    gulp.watch('less/*.less', ['less']);
    gulp.watch(['dist/css/*.css','!dist/css/*.min.css'], ['minify-css']);
    gulp.watch('dist/css/*.min.css', ['copy']);
    //gulp.watch('js/*.js', ['minify-js']);
    // Reloads the browser whenever HTML or JS files change
    //gulp.watch('*.html', browserSync.reload);
    //gulp.watch('js/**/*.js', browserSync.reload);
});

// Copy CSS to portofolio.
gulp.task('copy', function() {
    gulp.src('dist/css/blog_css.min.css')
        .pipe(gulp.dest('../../../../portofolio/css'));
    gulp.src('dist/css/blog_css.min.css')
        .pipe(rename({basename: "blog_css_min",extname: ".mtml"}))
        .pipe(gulp.dest('../templates'));
});

gulp.task( 'ftp', function () {
    var conn = ftp.create( {
        host:     '203.137.183.89',
        port: 21,
        user:     '4kbnx627',
        password: '6#.gyTGF',
        maxConnections: 1,
        parallel: 1,
        secure: true ,
        secureOptions: { rejectUnauthorized: false },
        parallel: 10,
        log:      gutil.log
    } );


    var globs = [
         '../templates/**.mtml'
    ];


    // using base = '.' will transfer everything to /public_html correctly
    // turn off buffering in gulp.src for best performance

    return gulp.src( globs, { base: '.', buffer: false } )
        // .pipe( conn.newer( '/themes/theme_from_portofolio/templates/' ) ) // only upload newer files
        .pipe( conn.dest( '/themes/theme_from_portofolio/templates/' ) );

} );
