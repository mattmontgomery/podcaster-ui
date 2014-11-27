var gulp       = require( 'gulp' ),
    sass       = require( 'gulp-sass' ),
    shell      = require( 'gulp-shell' );


var options = {
    path: './app/app.js',
    mongoData: './data/mongo'
};

gulp.task('server', shell.task([
    'npm start'
]));


gulp.task('watch', function(ev) {
    gulp.watch('style/*.scss', ['sass']);
})

gulp.task('sass', function() {
    gulp.src('style/*.scss')
        .pipe(sass())
        .on('error', function (err) { console.log(err.message); })
        .pipe(gulp.dest('assets'))
    ;
});

gulp.task('default', ['watch', 'server']);