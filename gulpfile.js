/**
 * These tasks are for building styles and packaging the plugin.
 *
 * IMPORTANT: DO NOT CALL GULP DIRECTLY. Use `npm run start` or `npm run build` instead.
 */

const autoprefixer = require( 'autoprefixer' ),
	browsers = require( '@wordpress/browserslist-config' ),
	concat = require( 'gulp-concat' ),
	cssnano = require( 'cssnano' ),
	gulp = require( 'gulp' ),
	mqpacker = require( 'css-mqpacker' ),
	path = require( 'path' ),
	postcss = require( 'gulp-postcss' ),
	rename = require( 'gulp-rename' ),
	sass = require( 'gulp-sass' )

// These files are the ones which will be included in the `package` task.
const buildInclude = [
	path.resolve( __dirname, './*.+(txt|php)' ), // All files in the root
	path.resolve( __dirname, './src/**' ),
	path.resolve( __dirname, './dist/**' ),
	path.resolve( __dirname, './freemius/**' ),
	path.resolve( __dirname, './images/**' ),
	'!' + path.resolve( __dirname, '**/+(__test__|test)/**' ), // No tests.
	'!' + path.resolve( __dirname, './src/**/*.+(js|scss|md|ai)' ), // No source.
	'!' + path.resolve( __dirname, './src/!(welcome)/**/*.svg' ), // No svgs except settings.
]

const postCSSOptions = [
	autoprefixer( { browsers } ), // Use WordPress browserslist.
	mqpacker(), // Combine media query rules.
	cssnano(), // Minify.
]

const sassOptions = {
	includePaths: path.resolve( __dirname, './src/' ),
}

// Gets all directories recursively.
const getDirectories = function( dir, filelist ) {
	const fs = require( 'fs' )
	const files = fs.readdirSync( dir )
	filelist = filelist || []

	if ( fs.statSync( dir ).isDirectory() ) {
		filelist.push( dir )
	}
	files.forEach( function( file ) {
	    if ( fs.statSync( path.join( dir, file ) ).isDirectory() ) {
			filelist = getDirectories( path.join( dir, file ), filelist )
		}
	} )
	return filelist
}

// Puts an index.php for all directories.
gulp.task( 'generate-indexphp', function() {
	const fs = require( 'fs' )
	const dirs = getDirectories( path.resolve( __dirname, 'build/stackable' ) )
	let g = gulp.src( path.resolve( __dirname, 'index.php' ) )
	dirs.filter( dir => {
		// Only do this for those who don't have an index.php yet.
		return ! fs.existsSync( path.resolve( dir, 'index.php' ) )
	} ).forEach( dir => {
		g = g.pipe( gulp.dest( dir ) )
	} )
	return g
} )

gulp.task( 'style-editor', function() {
	return gulp.src( path.resolve( __dirname, './src/**/editor.scss' ) )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'editor_blocks.css' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( gulp.dest( 'dist/' ) )
} )

gulp.task( 'style', function() {
	return gulp.src( [ path.resolve( __dirname, './src/common.scss' ), path.resolve( __dirname, './src/**/style.scss' ) ] )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'frontend_blocks.css' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( gulp.dest( 'dist/' ) )
} )

gulp.task( 'welcome-styles', function() {
	return gulp.src( path.resolve( __dirname, './src/welcome/admin.scss' ) )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( rename( {
			basename: 'admin_welcome',
			dirname: '',
		} ) )
		.pipe( gulp.dest( 'dist/' ) )
} )

gulp.task( 'build-process', gulp.parallel( 'style', 'style-editor', 'welcome-styles' ) )

gulp.task( 'build', gulp.series( 'build-process' ) )

gulp.task( 'package', function() {
	return gulp.src( buildInclude, { base: './' } )
		.pipe( gulp.dest( 'build/stackable' ) )
} )

const watchFuncs = () => {
	gulp.watch(
		[ path.resolve( __dirname, './src/**/*.scss' ) ],
		gulp.parallel( [ 'style', 'style-editor' ] )
	)
	gulp.watch(
		[ path.resolve( __dirname, './src/welcome/**/*.scss' ) ],
		gulp.parallel( [ 'welcome-styles' ] )
	)
}

gulp.task( 'watch', gulp.series( 'build-process', watchFuncs ) )

module.exports = {
	buildInclude,
	postCSSOptions,
	sassOptions,
	watchFuncs,
}
