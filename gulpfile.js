var
	gulp        = require('gulp'),
	less        = require('gulp-less'),
	changed     = require('gulp-changed'),
	browserify  = require('gulp-browserify')
;

var paths = {
	webpages: {
		src: ['./src/**/*.html', './src/**/*.php'],
		dest: './dist'
	},
	js: {
		src: './src/js/**/*.js',
		dest: './dist/js'
	},
	jsx: {
		src: './src/js/**/*.jsx',
		dest: './dist/js'
	},
	less: {
		src: './src/css/*',
		dest: './dist/css'
	},
	libs: {
		src: [
			'./node_modules/normalize-css/normalize.css',
			'./node_modules/semantic-ui/dist/semantic.min.js',
			'./node_modules/semantic-ui/dist/semantic.min.css'
		],
		dest: './dist/libs'
	},
	static: {
		src: './src/static/*',
		dest: './dist/static'
	}
};

gulp.task('web-pages', function() {
	return gulp.src(paths.webpages.src, {base: './src'})
		.pipe(changed(paths.webpages.dest))
		.pipe(gulp.dest(paths.webpages.dest));
});

gulp.task('Less', function() {
	return gulp.src(paths.less.src)
		.pipe(changed(paths.less.dest))
		.pipe(less())
		.pipe(gulp.dest(paths.less.dest));
});

gulp.task('libs', function() {
	return gulp.src(paths.libs.src)
		.pipe(changed(paths.libs.dest))
		.pipe(gulp.dest(paths.libs.dest));
});

gulp.task('browserify', function() {
	gulp.src('src/js/main.js')
		.pipe(browserify({
			insertGlobals : true,
			debug : !gulp.env.production
		}))
		.pipe(gulp.dest('dist/js'))
	;
});

gulp.task('default', ['web-pages', 'Less', 'libs', 'browserify']);
