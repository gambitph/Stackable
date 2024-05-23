/**
 * These tasks are for building styles and packaging the plugin.
 *
 * IMPORTANT: DO NOT CALL GULP DIRECTLY. Use `npm run start` or `npm run build` instead.
 */

const autoprefixer = require( 'autoprefixer' ),
	collect = require( 'gulp-collect-pattern' ),
	concat = require( 'gulp-concat' ),
	cssnano = require( 'cssnano' ),
	footer = require( 'gulp-footer' ),
	fs = require( 'fs' ),
	glob = require( 'glob' ),
	gulp = require( 'gulp' ),
	header = require( 'gulp-header' ),
	mqpacker = require( 'css-mqpacker' ),
	path = require( 'path' ),
	postcss = require( 'gulp-postcss' ),
	removeDuplicateLines = require( 'gulp-remove-duplicate-lines' ),
	rename = require( 'gulp-rename' ),
	replace = require( 'gulp-replace' ),
	sass = require( 'gulp-sass' )( require( 'sass' ) ),
	sassVariables = require( 'gulp-sass-variables' ),
	zip = require( 'gulp-zip' )

// These files are the ones which will be included in the `package` task.
const buildInclude = [
	path.resolve( __dirname, './*.+(txt|php)' ), // All files in the root.
	path.resolve( __dirname, './src/**/*.php' ), // Only PHP files in our source files, others will be compiled into dist.
	path.resolve( __dirname, './src/**/block.json' ), // Allow block metadata files.
	path.resolve( __dirname, './dist/**' ),
	path.resolve( __dirname, './freemius/**' ),
	path.resolve( __dirname, './languages/**' ),
	path.resolve( __dirname, './images/**' ),
	path.resolve( __dirname, './src/welcome/images/**' ), // Welcome screen / settings images.
	'!' + path.resolve( __dirname, './dist/videos/**' ), // Help tooltip videos.
	'!' + path.resolve( __dirname, './dist/**/*.js.map' ), // JS Map files.
	'!' + path.resolve( __dirname, './dist/**/*.js.map' ), // JS Map files.
	'!' + path.resolve( __dirname, './src/__*/**/*' ), // Development templates.
]

const postCSSOptions = [
	autoprefixer(),
	mqpacker(), // Combine media query rules.
	cssnano(), // Minify.
]

const sassOptions = {
	includePaths: [
		path.resolve( __dirname, './src/' ),
		path.resolve( __dirname, './src/styles' ),
		'./node_modules',
	],
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

gulp.task( 'generate-stk-block-typesphp', function( cb ) {
	// generate stk-block-types.php

	const fs = require( 'fs' )

	const toSnakeCase = str => {
		// Don't convert strings that are starting with 'stackable/
		return str.startsWith( 'stackable/' ) ? str : str.replace( /([a-z])([A-Z])/g, '$1_$2' ).toLowerCase()
	}

	const parseBlockJson = ( obj, callback, indent, parentKey = null ) => {
		let blockArgs = '[\n'
		const tab = '\t'.repeat( indent )
		const changeToSnakeCase = parentKey !== 'providesContext'
		if ( Array.isArray( obj ) ) {
			const els = []
			obj.forEach( item => {
				if ( Array.isArray( item ) || typeof item === 'object' ) {
					// if array contains another array or object as its element, parse it first
					els.push( `${ tab }${ parseBlockJson( item, callback, indent + 1, parentKey ) }` )
				} else {
					// array contains a string
					els.push( `${ tab }${ callback( parentKey, item, true, changeToSnakeCase ) }` )
				}
			} )
			blockArgs += els.join( ',\n' ) + '\n'
		} else if ( typeof obj === 'object' && obj !== null ) {
			const entries = Object.entries( obj )
			entries.forEach( ( [ key, value ], index ) => {
				if ( Array.isArray( value ) || typeof value === 'object' ) {
					// obj[key] contains another array or object
					blockArgs += `${ tab }'${ toSnakeCase( key ) }' => `
					blockArgs += parseBlockJson( value, callback, indent + 1, key )
				} else {
					// obj[key] contains a string
					blockArgs += `${ tab }${ callback( key, value, false, changeToSnakeCase ) }`
				}

				blockArgs += index === entries.length - 1 ? '\n' : ',\n'
			} )
		}

		blockArgs += '\t'.repeat( indent - 1 ) + ']'
		return blockArgs
	}

	const blockJsonToAssocArray = ( key, value, isArrayElement, changeToSnakeCase ) => {
		const needTranslate = [ 'title', 'description', 'keywords' ]
		const _value = needTranslate.includes( key ) ? `__( '${ value }', STACKABLE_I18N )` : `'${ value }'`

		// for array elements
		if ( isArrayElement ) {
			return _value
		}

		// for key-value pairs
		return `'${ changeToSnakeCase ? toSnakeCase( key ) : key }' => ${ _value }`
	}

	const getBlockNames = path => {
		return fs.readdirSync( path, { withFileTypes: true } )
			.filter( dirent => dirent.isDirectory() )
			.map( dirent => dirent.name )
	}

	const blocks = getBlockNames( path.resolve( __dirname, 'src/block' ) )
	const data = []

	blocks.forEach( block => {
		const jsonPath = path.resolve( __dirname, `src/block/${ block }/block.json` )
		if ( fs.existsSync( jsonPath ) ) {
			const fileContent = fs.readFileSync( jsonPath, 'utf-8' )
			const blockJson = JSON.parse( fileContent )
			const blockArgs = parseBlockJson( blockJson, blockJsonToAssocArray, 4 )
			const blockEntry = `'${ blockJson.name }' => ${ blockArgs }`
			data.push( blockEntry )
		}
	} )

	// Generate PHP variable string
	const script = `<?php
// This is a generated file by gulp generate-stk-block-typesphp

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! function_exists( 'stackable_get_blocks_array') ) {
	function stackable_get_blocks_array( $blocks = array() ) {
		$stk_blocks = array(
			${ data.join( ',\n\t\t\t' ) }
		);

		return array_merge( $blocks, $stk_blocks );
	}

	add_filter( 'stackable.blocks', 'stackable_get_blocks_array' );
}
?>`

	// Write PHP variable to file
	fs.writeFileSync( path.resolve( __dirname, 'src/stk-block-types.php' ), script )

	cb()
} )

gulp.task( 'generate-translations-js', gulp.series(
	// The collect function has an issue where it will not continue if the
	// folder will it writes to doesn't exist, create it to prevent an error.
	function translationsEnsureDistDir( cb ) {
		if ( ! fs.existsSync( path.resolve( __dirname, './dist' ) ) ) {
			fs.mkdirSync( path.resolve( __dirname, './dist' ) )
		}
		cb()
	},
	function gatherJSGetTextFuncs() {
		return gulp.src( [
			// Premium files aren't included in the json translation files, add
			// them.
			path.resolve( __dirname, './pro__premium_only/src/**/*.js' ),
			'!' + path.resolve( __dirname, './**/__test__/*.js' ),
			'!' + path.resolve( __dirname, './**/*.test.js' ),
			'!' + path.resolve( __dirname, './src/translation-strings.js' ),
		] )
			// Extract all gettext calls.
			.pipe( collect( {
				file: path.resolve( __dirname, './dist/translation-strings.js' ),
				regex: /(\/\/ translators:(.*)?[\s\n](.*)?)?_.\(\s*['"](.*?)\s?(i18n|STACKABLE_I18N)\s?\)/g,
			} ) )
	},
	function gatherBlockJsonStrings( cb ) {
		const strings = []
		// Block definitions block.json isn't automatically included in the
		// json translation files, we need to add our own translations.
		glob.sync( path.resolve( __dirname, './{src,pro__premium_only/src}/**/block.json' ) ).forEach( file => {
			// Ignore deprecated blocks.
			if ( file.includes( 'deprecated/' ) ) {
				return
			}

			const blockData = JSON.parse( fs.readFileSync( path.resolve( file ), 'utf8' ) )

			// Gather all the translatable strings.
			if ( blockData.title && ! strings.includes( blockData.title ) ) {
				strings.push( blockData.title )
			}
			if ( blockData.description && ! strings.includes( blockData.description ) ) {
				strings.push( blockData.description )
			}
			( blockData.keywords || [] ).forEach( keyword => {
				if ( ! strings.includes( keyword ) ) {
					strings.push( keyword )
				}
			} )

			// Gather all variants translatable strings.
			if ( blockData[ 'stk-variants' ] ) {
				blockData[ 'stk-variants' ].forEach( variant => {
					if ( variant.title && ! strings.includes( variant.title ) ) {
						strings.push( variant.title )
					}
					if ( variant.description && ! strings.includes( variant.description ) ) {
						strings.push( variant.description )
					}
				} )
			}
		} )

		// Append all the strings to the translation-strings.js file.
		const s = strings.map( s => `__( '${ s.replace( /'/g, `\'` ) }', i18n )` ).join()
		fs.appendFileSync( path.resolve( __dirname, './dist/translation-strings.js' ), `${ s }` )

		cb()
	},
	function cleanupJSTranslationFile() {
		return gulp.src( [ path.resolve( __dirname, './dist/translation-strings.js' ) ] )
			.pipe( replace( /((i18n|STACKABLE_I18N)\s?\))/g, '$1\n' ) ) // Separate translation into lines.
			.pipe( replace( /i18n(\s?\))/g, 'STACKABLE_I18N$1' ) ) // Replace i18n with STACKABLE_I18N.
			.pipe( replace( /STACKABLE_I18N/g, '\'stackable-ultimate-gutenberg-blocks\'' ) ) // Replace i18n with STACKABLE_I18N.

			// To lessen filesize, remove tabs, and other code like variable
			// assignments before the translation function.
			.pipe( replace( /^(.*?)(_.\()/gm, '$2' ) )

			// Put the translators comment on the end of the translation, since
			// we will be removing duplicates, and the comment might get
			// jumbled.
			.pipe( replace( /(\/\/ translators:(.*?))\n(_.\((.*?);)/g, '$3 $1' ) )
			.pipe( removeDuplicateLines( {
				include: '^_.', // Only remove duplicate lines on gettext calls.
			} ) ) // Remove duplicate lines.
			.pipe( header( `/**
 * This translation file is automatically generated by gulp generate-translations-js.
 */

// This doesn't run anything, this is just for loading the strings since WP
// won't generate them in the json/js language packs if they're not present in
// the script.
if ( false ) {
` ) )
			.pipe( footer( `
}
` ) )
			.pipe( gulp.dest( 'dist/' ) )
	}
) )

gulp.task( 'generate-translations-php', gulp.series(
	// The collect function has an issue where it will not continue if the
	// folder will it writes to doesn't exist, create it to prevent an error.
	function translationsEnsureDistDir( cb ) {
		if ( ! fs.existsSync( './dist' ) ) {
			fs.mkdirSync( './dist' )
		}
		cb()
	},
	function gatherAllGetTextFuncs() {
		return gulp.src( [
			path.resolve( __dirname, './src/**/*.js' ),
			path.resolve( __dirname, './pro__premium_only/src/**/*.js' ),
			'!' + path.resolve( __dirname, './src/test/*.js' ),
			'!' + path.resolve( __dirname, './**/__test__/*.js' ),
			'!' + path.resolve( __dirname, './src/translation-strings.js' ),
			path.resolve( __dirname, './pro__premium_only/*.php' ),
			path.resolve( __dirname, './pro__premium_only/src/**/*.php' ),
			'!./**/dist/**/*',
		 ] )
			// Extract all gettext calls.
			.pipe( collect( {
				file: 'dist/translation-strings.php',
				regex: /(\/\/ translators:(.*)?[\s\n](.*)?)?_.\(\s*['"](.*?)\s?(i18n|STACKABLE_I18N)\s?\)/g,
			} ) )
	},
	function cleanupPHPTranslationFile() {
		return gulp.src( [ 'dist/translation-strings.php' ] )
			.pipe( replace( /((i18n|STACKABLE_I18N)\s?\))/g, '$1;\n' ) ) // Separate translation into lines.
			.pipe( replace( /i18n(\s?\))/g, 'STACKABLE_I18N$1' ) ) // Replace i18n with STACKABLE_I18N.
			.pipe( replace( /STACKABLE_I18N/g, '\'stackable-ultimate-gutenberg-blocks\'' ) ) // Replace i18n with STACKABLE_I18N.

			// To lessen filesize, remove tabs, and other code like variable
			// assignments before the translation function.
			.pipe( replace( /^(.*?)(_.\()/gm, '$2' ) )

			// Put the translators comment on the end of the translation, since
			// we will be removing duplicates, and the comment might get
			// jumbled.
			.pipe( replace( /(\/\/ translators:(.*?))\n(_.\((.*?);)/g, '$3 $1' ) )
			.pipe( removeDuplicateLines( {
				include: '^_.', // Only remove duplicate lines on gettext calls.
			} ) ) // Remove duplicate lines.
			.pipe( header( `<?php
/**
 * Auto-generated translation file.
 */

// Exit if accessed
exit;

` ) )
			.pipe( gulp.dest( 'dist/' ) )
	}
) )

gulp.task( 'style-editor', function() {
	return gulp.src( [ path.resolve( __dirname, './src/**/editor.scss' ), '!' + path.resolve( __dirname, './src/deprecated/**/editor.scss' ) ] )
		// Override the breakpoints in the editor in
		// src/styles/breakpoints.scss, we do it here because there are various
		// files that use the breakpoints and it's easier to override it here.
		.pipe( sassVariables( {
			'$desktop-width': 781,
			'$tablet-width': 361,
		} ) )
		.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'editor_blocks.css' ) )
		// @see https://make.wordpress.org/core/2020/08/04/new-editor-preview-options/
		.pipe( header( '#start-resizable-editor-section{display:none}' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
		// Remove the dummy styles added in src/styles/breakpoints.scss which
		// are added to force correct sorting of media queries by mqpacker
		.pipe( replace( /.z\s?{\s?opacity:\s?1;?}/g, '' ) )
		.pipe( gulp.dest( 'dist/' ) )
} )

gulp.task( 'style', gulp.series(
	function styleGenerateFrontend() {
		return gulp.src( [ path.resolve( __dirname, './src/common.scss' ), path.resolve( __dirname, './src/styles/*.scss' ), path.resolve( __dirname, './src/**/style.scss' ), '!' + path.resolve( __dirname, './src/styles/editor-*.scss' ), '!' + path.resolve( __dirname, './src/deprecated/**/style.scss' ) ] )
			.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
			.pipe( concat( 'frontend_blocks.css' ) )
			// @see https://make.wordpress.org/core/2020/08/04/new-editor-preview-options/
			.pipe( header( '#start-resizable-editor-section{display:none}' ) )
			.pipe( postcss( postCSSOptions ) )
			.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
			// Remove the dummy styles added in src/styles/breakpoints.scss
			// which are added to force correct sorting of media queries by
			// mqpacker
			.pipe( replace( /.z\s?{\s?opacity:\s?1;?}/g, '' ) )
			.pipe( gulp.dest( 'dist/' ) )
	},
	// Build the lightbox specific styles.
	function styleImageLightboxCSS() {
		return gulp.src( [ path.resolve( __dirname, './src/lightbox/frontend-image-lightbox.scss' ) ] )
			.pipe( sass( sassOptions ).on( 'error', sass.logError ) )
			.pipe( postcss( postCSSOptions ) )
			.pipe( rename( {
				basename: 'frontend_image_lightbox',
				dirname: '',
			} ) )
			.pipe( gulp.dest( 'dist/' ) )
	},
	function generateResponsiveCSS() {
		return gulp.src( [ 'dist/frontend_blocks.css' ] )
			// Extract media queries and move them to another file.
			.pipe( collect( {
				file: 'dist/frontend_blocks_responsive.css',
				regex: /@media [\w\s\d]*screen(.*?)\}\}/g,
			} ) )
			// Remove the media queries from the stylesheet.
			.pipe( replace( /@media [\w\s\d]*screen(.*?)\}\}/g, '' ) )
			.pipe( gulp.dest( 'dist/' ) )
	},
	// Cleanup the responsiveness file.
	function styleCleanupResponsiveCSS() {
		return gulp.src( [ 'dist/frontend_blocks_responsive.css' ] )
			.pipe( header( '#start-resizable-editor-section{display:none}' ) )
			.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
			.pipe( gulp.dest( 'dist/' ) )
	},
	// Add the responsive styles to the dynamic breakpoint file.
	function styleGenerateResponsivePHP() {
		const css = fs.readFileSync( 'dist/frontend_blocks_responsive.css', 'utf8' )

		return gulp.src( [ path.resolve( __dirname, './src/dynamic-breakpoints.php' ) ] )
			.pipe( replace(
				/return <<<STK_RESPONSIVE_CSS([\s\S]*?)STK_RESPONSIVE_CSS;/gm,
				`return <<<STK_RESPONSIVE_CSS
${ css }
STK_RESPONSIVE_CSS;`
			) )
			.pipe( gulp.dest( path.resolve( __dirname, './src/' ) ) )
	}
) )

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
		// @see https://make.wordpress.org/core/2020/08/04/new-editor-preview-options/
		.pipe( header( '#start-resizable-editor-section{display:none}' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
		.pipe( gulp.dest( 'dist/deprecated/' ) )
} )

gulp.task( 'style-deprecated-v2', function() {
	return gulp.src( [
		path.resolve( __dirname, './src/deprecated/v2/common.scss' ),
		path.resolve( __dirname, './src/format-types/highlight/style.scss' ),
		path.resolve( __dirname, './src/deprecated/v2/**/style.scss' ),
	] )
		.pipe( sass( deprecatedV2SassOptions ).on( 'error', sass.logError ) )
		.pipe( concat( 'frontend_blocks_deprecated_v2.css' ) )
		// @see https://make.wordpress.org/core/2020/08/04/new-editor-preview-options/
		.pipe( header( '#start-resizable-editor-section{display:none}' ) )
		.pipe( postcss( postCSSOptions ) )
		.pipe( footer( '#end-resizable-editor-section{display:none}' ) )
		.pipe( gulp.dest( 'dist/deprecated/' ) )
} )

gulp.task( 'style-deprecated', gulp.parallel(
	'style-editor-deprecated-v2',
	'style-deprecated-v2',
) )

/*********************************************************************
 * END deprecated build styles, we still build these
 ********************************************************************/

gulp.task( 'build-process', gulp.parallel( 'style', 'style-editor', 'welcome-styles', 'style-deprecated', 'generate-translations-js', 'generate-stk-block-typesphp' ) )

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

	gulp.watch(
		[ `${ basePath }/src/block/**/block.json` ],
		gulp.parallel( [ 'generate-stk-block-typesphp' ] )
	)
}

gulp.task( 'watch', gulp.series( 'build-process', function watch( done ) {
	watchFuncs()
	done()
} ) )

module.exports.watchFuncs = watchFuncs
