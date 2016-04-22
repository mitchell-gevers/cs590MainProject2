/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util');

// create a default task and just log a message
gulp.task('default', ['copyFiles'], function() {
  return gutil.log('Gulp is running!');
});

gulp.task('copyFiles', function() {
	gutil.log('Gulp is copying!');
	gulp.src('source/*.html').pipe(gulp.dest('public'));
	gulp.src('source/*.css').pipe(gulp.dest('public'));
	gulp.src('source/*.jpg').pipe(gulp.dest('public'));
});