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
	'!' + path.resolve( __dirname, './src/posthog-config.php' ), // Local PostHog secrets from .env.
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

gulp.task( 'generate-block-design-system-php', function( cb ) {
	const fs = require( 'fs' )

	let blockDesignSystem = 'array()'

	const toAssocArray = ( key, value, cb, indent ) => {
		if ( typeof value === 'object' ) {
			const parsed = cb( value, indent + 1 )
			return `"${ key }" => ${ parsed }`
		}

		if ( typeof value === 'string' ) {
			return `"${ key }" => "${ value }"`
		}

		return `"${ key }" => ${ value }`
	}

	const parseBlockDesignSystem = ( obj, indent ) => {
		let content = ''
		const tab = '\t'.repeat( indent )

		if ( typeof obj === 'object' ) {
			content += 'array(\n'

			Object.entries( obj ).forEach( ( [ key, value ], index, bds ) => {
				if ( key === 'hoverStates' ) {
					return
				}

				content += tab + toAssocArray( key, value, parseBlockDesignSystem, indent )

				if ( index !== bds.length - 1 ) {
					content += ',\n'
				} else {
					content += '\n'
				}
			} )
			content += `\t`.repeat( indent - 1 ) + ')'
		}
		return content
	}

	const parseBlockDesignSystemSections = ( sections, indent ) => {
		const combined = {}
		Object.values( sections ).forEach( section => {
			Object.entries( section ).forEach( ( [ key, value ] ) => {
				combined[ key ] = value
			} )
		} )

		return parseBlockDesignSystem( combined, indent )
	}
	const jsonPath = path.resolve( __dirname, `src/styles/block-design-system.json` )
	if ( fs.existsSync( jsonPath ) ) {
		const fileContent = fs.readFileSync( jsonPath, 'utf-8' )
		const raw = JSON.parse( fileContent )
		blockDesignSystem = parseBlockDesignSystemSections( raw, 4 )
	}

	// Generate PHP variable string
	const script = `<?php
// This is a generated file by gulp generate-block-design-system-php
// Use block-design-system.json if you want to edit this file.

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Stackable_Block_Design_System') ) {
	class Stackable_Block_Design_System {

		function __construct() {
		}

		public static function get_block_design_system() {
			$block_design_system = ${ blockDesignSystem };

			return $block_design_system;
		}
	}

	new Stackable_Block_Design_System();
}
?>
`
	// Write PHP variable to file
	fs.writeFileSync( path.resolve( __dirname, 'src/styles/block-design-system.php' ), script )

	cb()
} )

gulp.task( 'generate-block-design-system-scss', function( cb ) {
	const fs = require( 'fs' )

	let blockDesignSystem = ''

	const getFourRangeValue = sides => {
		if ( Object.values( sides ).every( s => s === sides.top ) ) {
			return `${ sides.top }px`
		}

		if ( sides.top === sides.bottom && sides.right === sides.left ) {
			return `${ sides.top }px ${ sides.right }px`
		}

		return `${ sides.top }px ${ sides.right }px ${ sides.bottom }px ${ sides.left }px`
	}

	const getDeviceValue = ( obj, device = 'desktop' ) => {
		const value = obj[ device ]

		if ( typeof value === 'number' ) {
			return `${ value }px`
		}

		if ( typeof value === 'object' ) {
			return `${ getFourRangeValue( value ) }`
		}

		if ( value === '' ) {
			return 'none'
		}

		return value
	}

	const getValue = ( property, obj, indent ) => {
		if ( Object.keys( obj ).length === 1 ) {
			return getDeviceValue( obj )
		}

		const tab = `\t`.repeat( indent )
		let content = getDeviceValue( obj )
		let hoverProperties = ''
		if ( 'hoverStates' in obj ) {
			hoverProperties += ',\n'
			const _hoverProperties = []
			Object.keys( obj.hoverStates ).forEach( state => {
				if ( obj.hoverStates[ state ] ) {
					_hoverProperties.push( tab + `${ property }-${ state }: cssvar(${ property })` )
				}
			} )
			hoverProperties += _hoverProperties.join( ',\n' )
		}

		if ( 'hoverStates' in obj && Object.keys( obj ).length === 2 ) {
			content += hoverProperties
			return content
		}

		content = '(\n'
		Object.keys( obj ).forEach( device => {
			if ( device === 'hoverStates' ) {
				return
			}
			content += `\t`.repeat( indent + 1 ) + `${ device }: ${ getDeviceValue( obj, device ) },\n`
		} )
		content += tab + ')'
		content += hoverProperties

		return content
	}

	const parseBlockDesignSystem = ( obj, indent ) => {
		let content = ''
		const tab = `\t`.repeat( indent )
		Object.entries( obj ).forEach( ( [ key, v ] ) => {
			const value = getValue( key, v, indent )
			content += tab + `${ key }: ${ value },\n`
		} )
		return content
	}

	const parseBlockDesignSystemSections = ( sections, indent ) => {
		let content = ''
		if ( typeof sections === 'object' ) {
			Object.entries( sections ).forEach( ( [ section, obj ], index, s ) => {
				content += `	/**
	 * ${ section }
	 */
`
				content += parseBlockDesignSystem( obj, indent )
				content += index !== s.length - 1 ? '\n' : ''
			} )
		}
		return content
	}

	const jsonPath = path.resolve( __dirname, `src/styles/block-design-system.json` )
	if ( fs.existsSync( jsonPath ) ) {
		const fileContent = fs.readFileSync( jsonPath, 'utf-8' )
		const raw = JSON.parse( fileContent )
		blockDesignSystem = parseBlockDesignSystemSections( raw, 1 )
	}

	// Generate PHP variable string
	const script = `@import "cssvars";
// This is a generated file by gulp generate-block-design-system-scss
// Use block-design-system.json if you want to edit this file.

/**
 * Default Stackable UI Kit design.
 */
$block-design-system: (
${ blockDesignSystem });
`
	// Write to SCSS file
	fs.writeFileSync( path.resolve( __dirname, 'src/styles/block-design-system.scss' ), script )

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

/**
 * Per-block frontend CSS.
 *
 * Builds the same sources as the `style` task, but instead of one bundle it
 * writes:
 *
 *  - dist/frontend_core.css              Shared styles (common, styles/*, block-components/*) minus the
 *                                        design-system, color-scheme and theme-specific rules below.
 *  - dist/frontend_core_responsive.css   Shared styles that come after the blocks in the bundle
 *                                        (highlight, div, cimo) + all shared screen media queries.
 *  - dist/frontend_color_schemes.css     Shared color scheme rules (only loaded if color schemes are used).
 *  - dist/frontend_design_system.css     Spacing & borders / buttons & icons rules (only loaded if used).
 *  - dist/frontend_theme_{theme}.css     Theme compatibility rules (only loaded for that theme).
 *  - dist/blocks/{block}.css             One file per block (with its own media queries).
 *  - dist/frontend_css_manifest.php      Block order (the order the bundle used) and file info for PHP.
 *
 * The color scheme selector list is replaced with a single marker class, PHP
 * adds the marker to all the elements the list used to match.
 *
 * The legacy bundle (frontend_blocks.css) is still built as before, it's used
 * by the editor and when the "legacy frontend CSS" compatibility option is on.
 */
const STK_SCHEME_MARKER = 'stk-has-scheme'
const THEME_COMPAT_DIRS = {
	blocksy: 'blocksy',
	'hello-elementor': 'helloelementor',
	tove: 'tove',
	'twenty-twenty-five': 'twentytwentyfive',
}

const splitFrontendSources = () => [
	path.resolve( __dirname, './src/common.scss' ),
	path.resolve( __dirname, './src/styles/*.scss' ),
	path.resolve( __dirname, './src/**/style.scss' ),
	'!' + path.resolve( __dirname, './src/styles/editor-*.scss' ),
	// Editor-only styles for deprecated blocks, not needed in the frontend.
	'!' + path.resolve( __dirname, './src/styles/deprecated-editor-block.scss' ),
	'!' + path.resolve( __dirname, './src/deprecated/**/style.scss' ),
]

// Compiles each source file (in the same order as the bundle) and returns [ { file, css } ].
const compileEach = ( sources, variables = {}, options = sassOptions ) => new Promise( ( resolve, reject ) => {
	const through2 = require( 'through2' )
	const out = []
	gulp.src( sources )
		.pipe( sassVariables( variables ) )
		.pipe( sass( options ).on( 'error', reject ) )
		.pipe( through2.obj( ( file, enc, cb ) => {
			out.push( { file: path.relative( __dirname, file.history[ 0 ] ).replace( /\\/g, '/' ), css: file.contents.toString() } )
			cb()
		} ) )
		.on( 'finish', () => resolve( out ) )
		.on( 'error', reject )
} )
module.exports.compileEach = compileEach

const postcssProcess = async ( css, prepend = '' ) => {
	const result = await require( 'postcss' )( postCSSOptions ).process( prepend + css, { from: undefined } )
	// Remove the dummy styles added in src/styles/breakpoints.scss
	return result.css.replace( /.z\s?{\s?opacity:\s?1;?}/g, '' )
		// And remove media queries left empty.
		.replace( /@media[^{}]+\{\}/g, '' )
}
module.exports.postcssProcess = postcssProcess

const isScreenMedia = node => node.type === 'atrule' && node.name === 'media' && /screen/.test( node.params )
const nodesToCss = nodes => nodes.map( n => n.toString() ).join( '' )

gulp.task( 'style-split', async function styleSplitFrontend() {
	const postcssLib = require( 'postcss' )
	const variables = { '$stk-has-color-schemes-selector': `.${ STK_SCHEME_MARKER }` }
	const compiled = await compileEach( splitFrontendSources(), variables )

	// Block styles start with `@import "common"`, which prints all the shared
	// styles again (the bundle relied on cssnano removing the duplicates). Strip
	// the shared styles from the start of each block's compiled CSS.
	const commonCss = compiled.find( ( { file } ) => file === 'src/common.scss' ).css
	// The dummy media query rules in breakpoints.scss fix the order of media
	// queries (mqpacker keeps the order of first appearance). Prepend them to
	// each separately processed file so its media queries are ordered the same
	// as in the bundle.
	const mediaOrderCss = compiled.find( ( { file } ) => file === 'src/styles/breakpoints.scss' ).css

	const core = [], blocks = [], themes = {}
	compiled.forEach( ( { file, css } ) => {
		let m
		if ( ( m = file.match( /^src\/block\/([^/]+)\/style\.scss$/ ) ) ) {
			if ( /^@import\s+["']common["']/m.test( fs.readFileSync( file, 'utf8' ) ) ) {
				if ( ! css.startsWith( commonCss ) ) {
					throw new Error( `style-split: cannot strip the common styles from ${ file }` )
				}
				css = css.substring( commonCss.length )
			}
			blocks.push( { name: m[ 1 ], css } )
		} else if ( ( m = file.match( /^src\/compatibility\/([^/]+)\/style\.scss$/ ) ) ) {
			const theme = THEME_COMPAT_DIRS[ m[ 1 ] ] || m[ 1 ].replace( /-/g, '' )
			themes[ theme ] = ( themes[ theme ] || [] ).concat( css )
		} else {
			core.push( css )
		}
	} )

	// The shared styles are processed together so duplicates are removed and
	// media queries are combined/sorted the same way as in the bundle.
	const root = postcssLib.parse( await postcssProcess( core.join( '' ) ) )
	const out = { core: [], responsive: [], schemes: [], designSystem: [] }
	const themeRules = {}
	root.nodes.forEach( node => {
		if ( isScreenMedia( node ) ) {
			return out.responsive.push( node )
		}
		if ( node.type === 'rule' ) {
			const sels = node.selectors
			if ( sels.every( s => s.includes( '.' + STK_SCHEME_MARKER ) ) ) {
				return out.schemes.push( node )
			}
			if ( sels.every( s => s.startsWith( ':where(.stk-has-design-system-' ) ) ) {
				return out.designSystem.push( node )
			}
			const themesUsed = [ ...new Set( sels.map( s => ( s.match( /\.stk--is-([a-z0-9]+)-theme/ ) || [] )[ 1 ] ) ) ]
			if ( themesUsed.length === 1 && themesUsed[ 0 ] ) {
				themeRules[ themesUsed[ 0 ] ] = ( themeRules[ themesUsed[ 0 ] ] || [] ).concat( node )
				return
			}
		}
		out.core.push( node )
	} )

	// Same order as in the bundle (by block folder name), independent of the
	// order the files were found.
	blocks.sort( ( a, b ) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0 )
	for ( const block of blocks ) {
		block.processed = await postcssProcess( block.css, mediaOrderCss )
	}

	// Start clean so removed blocks / themes don't leave stale files.
	fs.rmSync( 'dist/blocks', { recursive: true, force: true } )
	fs.mkdirSync( 'dist/blocks', { recursive: true } )
	glob.sync( 'dist/frontend_theme_*.css' ).forEach( f => fs.unlinkSync( f ) )
	const write = ( file, css ) => fs.writeFileSync( path.resolve( __dirname, file ), css )
	write( 'dist/frontend_core.css', nodesToCss( out.core ) )
	write( 'dist/frontend_core_responsive.css', nodesToCss( out.responsive ) )
	write( 'dist/frontend_color_schemes.css', nodesToCss( out.schemes ) )
	write( 'dist/frontend_design_system.css', nodesToCss( out.designSystem ) )

	const manifest = { blocks: {}, themes: {} }
	for ( const theme of [ ...new Set( Object.keys( themeRules ).concat( Object.keys( themes ) ) ) ] ) {
		const extra = themes[ theme ] ? await postcssProcess( themes[ theme ].join( '' ), mediaOrderCss ) : ''
		const css = nodesToCss( themeRules[ theme ] || [] ) + extra
		if ( css.trim() ) {
			write( `dist/frontend_theme_${ theme }.css`, css )
			manifest.themes[ theme ] = css.length
		}
	}
	for ( const { name, processed: blockCss } of blocks ) {
		if ( blockCss.trim() ) {
			write( `dist/blocks/${ name }.css`, blockCss )
			manifest.blocks[ name ] = blockCss.length
		}
	}

	// PHP manifest, the block order is the order in the bundle.
	const phpArray = obj => 'array( ' + Object.entries( obj ).map( ( [ k, v ] ) => `'${ k }' => ${ v }` ).join( ', ' ) + ' )'
	write( 'dist/frontend_css_manifest.php', `<?php
// This is a generated file by gulp style-split.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
return array(
	'blocks' => ${ phpArray( manifest.blocks ) },
	'themes' => ${ phpArray( manifest.themes ) },
	'color_schemes' => ${ out.schemes.length ? 'true' : 'false' },
	'design_system' => ${ out.designSystem.length ? 'true' : 'false' },
);
` )
} )

gulp.task( 'style-editor', function() {
	return gulp.src( [ path.resolve( __dirname, './src/**/editor.scss' ), '!' + path.resolve( __dirname, './src/deprecated/**/editor.scss' ) ] )
		// The active theme can change the editor preview widths at runtime.
		// Use the editor's current device class rather than fixed Sass breakpoints.
		.pipe( sassVariables( {
			'$use-editor-preview-classes': true,
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

		// Only used by the legacy frontend CSS loading.
		return gulp.src( [ path.resolve( __dirname, './src/deprecated/legacy-frontend-css.php' ) ] )
			.pipe( replace(
				/return <<<STK_RESPONSIVE_CSS([\s\S]*?)STK_RESPONSIVE_CSS;/gm,
				`return <<<STK_RESPONSIVE_CSS
${ css }
STK_RESPONSIVE_CSS;`
			) )
			.pipe( gulp.dest( path.resolve( __dirname, './src/deprecated/' ) ) )
	},
	'style-split'
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

gulp.task( 'build-block-design-system', gulp.parallel( 'generate-block-design-system-php', 'generate-block-design-system-scss' ) )

gulp.task( 'build', gulp.series( 'build-block-design-system', 'build-process' ) )

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
		[ `${ basePath }/src/styles/block-design-system.json` ],
		gulp.parallel( [ 'generate-block-design-system-php', 'generate-block-design-system-scss' ] )
	)
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

gulp.task( 'watch', gulp.series( 'build-block-design-system', 'build-process', function watch( done ) {
	watchFuncs()
	done()
} ) )

module.exports.watchFuncs = watchFuncs
