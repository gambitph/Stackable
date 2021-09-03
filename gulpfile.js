/**
 * These tasks are for building styles and packaging the plugin.
 *
 * IMPORTANT: DO NOT CALL GULP DIRECTLY. Use `npm run start` or `npm run build` instead.
 */

const autoprefixer = require( 'autoprefixer' ),
	concat = require( 'gulp-concat' ),
	cssnano = require( 'cssnano' ),
	footer = require( 'gulp-footer' ),
	gulp = require( 'gulp' ),
	header = require( 'gulp-header' ),
	mqpacker = require( 'css-mqpacker' ),
	path = require( 'path' ),
	postcss = require( 'gulp-postcss' ),
	rename = require( 'gulp-rename' ),
	sass = require( 'gulp-sass' ),
	zip = require( 'gulp-zip' )

// These files are the ones which will be included in the `package` task.
const buildInclude = [
	path.resolve( __dirname, './*.+(txt|php)' ), // All files in the root.
	path.resolve( __dirname, './src/**/*.php' ), // Only PHP files in our source files, others will be compiled into dist.
	path.resolve( __dirname, './src/**/block.json' ), // Allow block metadata files.
	path.resolve( __dirname, './dist/**' ),
	path.resolve( __dirname, './freemius/**' ),
	path.resolve( __dirname, './images/**' ),
	path.resolve( __dirname, './src/welcome/images/**' ), // Welcome screen / settings images.
	'!' + path.resolve( __dirname, './dist/videos/**' ), // Help tooltip videos.
	'!' + path.resolve( __dirname, './dist/*.js.map' ), // JS Map files.
]

const postCSSOptions = [
	autoprefixer(),
	mqpacker(), // Combine media query rules.
	cssnano(), // Minify.
]

const sassOptions = {
	includePaths: path.resolve( __dirname, './src/' ),
}

module.exports = {
	buildInclude,
	postCSSOptions,
	sassOptions,
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
	return gulp.src( [ path.resolve( __dirname, './src/**/editor.scss' ), '!' + path.resolve( __dirname, './src/deprecated/**/editor.scss' ) ] )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'editor_blocks.css' ) )
		.pipe( header( '#start-resizable-editor-section{display:none}' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
		.pipe( gulp.dest( 'dist/' ) )
} )

gulp.task( 'style', function() {
	return gulp.src( [ path.resolve( __dirname, './src/common.scss' ), path.resolve( __dirname, './src/styles/*.scss' ), path.resolve( __dirname, './src/**/style.scss' ), '!' + path.resolve( __dirname, './src/deprecated/**/style.scss' ) ] )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'frontend_blocks.css' ) )
		// @see https://make.wordpress.org/core/2020/08/04/new-editor-preview-options/
		.pipe( header( '#start-resizable-editor-section{display:none}' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
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

/*********************************************************************
 * START deprecated build styles, we still build these
 ********************************************************************/

const deprecatedV2SassOptions = {
	includePaths: path.resolve( __dirname, './src/deprecated/v2/' ),
}
module.exports.deprecatedV2SassOptions = deprecatedV2SassOptions

gulp.task( 'style-editor-deprecated-v2', function() {
	return gulp.src( [ path.resolve( __dirname, './src/deprecated/v2/**/editor.scss' ) ] )
		.pipe( sass( deprecatedV2SassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'editor_blocks_deprecated_v2.css' ) )
		.pipe( header( '#start-resizable-editor-section{display:none}' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
		.pipe( gulp.dest( 'dist/deprecated/' ) )
} )

gulp.task( 'style-deprecated-v2', function() {
	return gulp.src( [ path.resolve( __dirname, './src/deprecated/v2/common.scss' ), path.resolve( __dirname, './src/deprecated/v2/**/style.scss' ) ] )
		.pipe( sass( deprecatedV2SassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'frontend_blocks_deprecated_v2.css' ) )
		.pipe( header( '#start-resizable-editor-section{display:none}' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
		.pipe( gulp.dest( 'dist/deprecated/' ) )
} )

gulp.task( 'style-deprecated-v1', function() {
	return gulp.src( [ path.resolve( __dirname, './src/deprecated/v1/*.scss' ) ] )
		.pipe( sass( deprecatedV2SassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'frontend_blocks_deprecated.css' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( gulp.dest( 'dist/deprecated/' ) )
} )

gulp.task( 'style-deprecated', gulp.parallel(
	'style-editor-deprecated-v2',
	'style-deprecated-v2',
	'style-deprecated-v1',
) )

/*********************************************************************
 * END deprecated build styles, we still build these
 ********************************************************************/

gulp.task( 'build-process', gulp.parallel( 'style', 'style-editor', 'welcome-styles', 'style-deprecated' ) )

gulp.task( 'build', gulp.series( 'build-process' ) )

gulp.task( 'package', function() {
	return gulp.src( buildInclude, { base: './' } )
		.pipe( gulp.dest( 'build/stackable' ) )
} )

// Zips the build folder.
gulp.task( 'zip', function() {
	return gulp.src( 'build/stackable/**/*' )
		.pipe( zip( 'stackable.zip' ) )
		.pipe( gulp.dest( 'build' ) )
} )

const watchFuncs = ( basePath = '.' ) => {
	gulp.watch(
		[ `${ basePath }/src/**/*.scss` ],
		gulp.parallel( [ 'style', 'style-editor', 'welcome-styles', 'style-deprecated' ] )
	)

	gulp.watch(
		[ `${ basePath }/src/welcome/**/*.scss` ],
		gulp.parallel( [ 'welcome-styles' ] )
	)
}

gulp.task( 'watch', gulp.series( 'build-process', function watch( done ) {
	watchFuncs()
	done()
} ) )

module.exports.watchFuncs = watchFuncs
