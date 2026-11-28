/* eslint-disable no-console */
/* eslint-env node */

const fs = require( 'fs' )
const path = require( 'path' )
const Ajv = require( 'ajv' )

const schema = require( '../../src/site-kits/schema/site-kit-v1.schema.json' )

const SITE_KIT_VERSION = 1
const MEDIA_URL_PATTERN = /(?:https?:)?\/\/[^\s"'<>\\)]+?\.(?:avif|gif|jpe?g|png|svg|webp|mp4|webm|mp3|wav|ogg|pdf|woff2?|ttf|otf)(?:[?#][^\s"'<>\\)]*)?/gi
const EMBEDDED_MEDIA_URL_PATTERN = /(?:\b(?:src|poster)\s*=\s*["']|\burl\(\s*["']?)((?:https?:)?\/\/[^\s"'<>\\)]+)/gi
const NAMED_MEDIA_URL_PATTERN = /["'](?:[^"']*(?:image|media|background|poster|video|audio|font|logo|icon|src)[^"']*)["']\s*:\s*["']((?:https?:)?\/\/[^\s"'<>\\)]+)/gi
const PACKAGE_MEDIA_PATTERN = /(?:^|["'(\s])((?:assets\/)[A-Za-z0-9._/-]+)/g

const ajv = new Ajv( {
	allErrors: true,
	jsonPointers: true,
} )
const validateSchema = ajv.compile( schema )

const createError = ( code, fieldPath, message ) => ( {
	code,
	path: fieldPath || '/',
	message,
} )

const getSchemaErrorPath = error => {
	if ( error.keyword === 'required' ) {
		return `${ error.dataPath || '' }/${ error.params.missingProperty }` || '/'
	}
	return error.dataPath || '/'
}

const getSchemaErrorCode = error => {
	if ( error.keyword === 'pattern' && /^\/media\/\d+\/path$/.test( error.dataPath ) ) {
		return 'invalid_path'
	}
	return `schema_${ error.keyword }`
}

const normalizePackagePath = filePath => filePath.replace( /\\/g, '/' ).replace( /^\.\//, '' )

const isPortablePackagePath = filePath => {
	if ( typeof filePath !== 'string' || ! filePath || filePath.includes( '\\' ) ) {
		return false
	}

	const normalized = normalizePackagePath( filePath )
	if ( normalized.startsWith( '/' ) || /^[A-Za-z][A-Za-z0-9+.-]*:/.test( normalized ) ) {
		return false
	}

	return normalized.split( '/' ).every( segment => segment && segment !== '.' && segment !== '..' )
}

const collectDuplicateErrors = ( values, fieldPath, name ) => {
	const seen = new Set()
	const errors = []

	values.forEach( ( value, index ) => {
		if ( seen.has( value ) ) {
			errors.push( createError(
				'duplicate_value',
				`${ fieldPath }/${ index }`,
				`${ name } must be unique. Duplicate value: ${ value }`
			) )
		}
		seen.add( value )
	} )

	return errors
}

const collectExternalMediaErrors = ( value, fieldPath = '' ) => {
	if ( typeof value === 'string' ) {
		const urls = new Set( value.match( MEDIA_URL_PATTERN ) || [] )
		let embeddedMatch
		EMBEDDED_MEDIA_URL_PATTERN.lastIndex = 0
		while ( ( embeddedMatch = EMBEDDED_MEDIA_URL_PATTERN.exec( value ) ) !== null ) {
			urls.add( embeddedMatch[ 1 ] )
		}
		NAMED_MEDIA_URL_PATTERN.lastIndex = 0
		while ( ( embeddedMatch = NAMED_MEDIA_URL_PATTERN.exec( value ) ) !== null ) {
			urls.add( embeddedMatch[ 1 ] )
		}
		return Array.from( urls ).map( url => createError(
			'external_media_url',
			fieldPath || '/',
			`External media must be packaged locally: ${ url }`
		) )
	}

	if ( Array.isArray( value ) ) {
		return value.flatMap( ( item, index ) => collectExternalMediaErrors( item, `${ fieldPath }/${ index }` ) )
	}

	if ( value && typeof value === 'object' ) {
		return Object.entries( value ).flatMap( ( [ key, item ] ) =>
			collectExternalMediaErrors( item, `${ fieldPath }/${ key }` )
		)
	}

	return []
}

const collectPackageMediaReferences = value => {
	if ( typeof value === 'string' ) {
		const references = []
		let match
		PACKAGE_MEDIA_PATTERN.lastIndex = 0
		while ( ( match = PACKAGE_MEDIA_PATTERN.exec( value ) ) !== null ) {
			references.push( normalizePackagePath( match[ 1 ] ) )
		}
		return references
	}

	if ( Array.isArray( value ) ) {
		return value.flatMap( collectPackageMediaReferences )
	}

	if ( value && typeof value === 'object' ) {
		return Object.values( value ).flatMap( collectPackageMediaReferences )
	}

	return []
}

const flattenMenuItems = items => items.flatMap( item => [ item, ...flattenMenuItems( item.children || [] ) ] )

const collectMediaIdTokens = ( value, collecting = false ) => {
	if ( typeof value === 'string' ) {
		if ( collecting ) {
			return [ value ]
		}
		const tokens = []
		const blockPattern = /<!--\s+wp:[^\s]+\s+({.*?})\s*(?:\/)?-->/g
		let blockMatch
		while ( ( blockMatch = blockPattern.exec( value ) ) !== null ) {
			try {
				tokens.push( ...collectMediaIdTokens( JSON.parse( blockMatch[ 1 ] ) ) )
			} catch ( error ) {
				// Schema and block validation report malformed content separately.
			}
		}
		return tokens
	}
	if ( Array.isArray( value ) ) {
		return value.flatMap( item => collectMediaIdTokens( item, collecting ) )
	}
	if ( value && typeof value === 'object' ) {
		return Object.entries( value ).flatMap( ( [ key, item ] ) =>
			collectMediaIdTokens( item, collecting || key === 'stkSiteKitMediaIds' )
		)
	}
	return []
}

const validateReferences = packageData => {
	const errors = []
	const pageSlugs = new Set( packageData.pages.map( page => page.slug ) )
	const mediaIds = new Set( packageData.media.map( media => media.id ) )

	if ( packageData.site.showOnFront === 'page' && ( packageData.site.frontPage === null || packageData.site.frontPage === '' ) ) {
		errors.push( createError(
			'front_page_required',
			'/site/frontPage',
			'A front page slug is required when showOnFront is page.'
		) )
	}

	for ( const key of [ 'frontPage', 'postsPage' ] ) {
		const pageSlug = packageData.site[ key ]
		if ( pageSlug !== null && pageSlug !== '' && ! pageSlugs.has( pageSlug ) ) {
			errors.push( createError(
				'unknown_page_reference',
				`/site/${ key }`,
				`Referenced page does not exist: ${ pageSlug }`
			) )
		}
	}

	packageData.pages.forEach( ( page, index ) => {
		if ( page.featuredMedia && ! mediaIds.has( page.featuredMedia ) ) {
			errors.push( createError(
				'unknown_media_reference',
				`/pages/${ index }/featuredMedia`,
				`Referenced media does not exist: ${ page.featuredMedia }`
			) )
		}
	} )

	collectMediaIdTokens( packageData ).forEach( mediaId => {
		if ( ! mediaIds.has( mediaId ) ) {
			errors.push( createError(
				'unknown_media_reference',
				'/',
				`Referenced media does not exist: ${ mediaId }`
			) )
		}
	} )

	flattenMenuItems( packageData.menu.items ).forEach( ( item, index ) => {
		if ( ! pageSlugs.has( item.page ) ) {
			errors.push( createError(
				'unknown_page_reference',
				`/menu/items/${ index }/page`,
				`Referenced page does not exist: ${ item.page }`
			) )
		}
	} )

	return errors
}

const validateSiteKitPackage = ( packageData, options = {} ) => {
	const {
		directorySlug = '',
		files = [],
		unsafeFiles = [],
	} = options
	const errors = []

	if ( Number.isInteger( packageData?.version ) && packageData.version !== SITE_KIT_VERSION ) {
		errors.push( createError(
			'unknown_version',
			'/version',
			`Unsupported Site Kit package version: ${ packageData.version }`
		) )
	}

	if ( ! validateSchema( packageData ) ) {
		const hasUnknownVersion = errors.some( error => error.code === 'unknown_version' )
		validateSchema.errors
			.filter( error => ! ( hasUnknownVersion && error.keyword === 'const' && error.dataPath === '/version' ) )
			.forEach( error => {
				errors.push( createError(
					getSchemaErrorCode( error ),
					getSchemaErrorPath( error ),
					error.message
				) )
			} )
	}

	if ( errors.some( error => error.code.startsWith( 'schema_' ) ) ) {
		return errors
	}

	if ( directorySlug && directorySlug !== packageData.slug ) {
		errors.push( createError(
			'slug_mismatch',
			'/slug',
			`Package slug ${ packageData.slug } does not match directory ${ directorySlug }.`
		) )
	}

	unsafeFiles.forEach( filePath => {
		errors.push( createError(
			'invalid_path',
			'/media',
			`Package files must not be symbolic links: ${ normalizePackagePath( filePath ) }`
		) )
	} )

	const packageFiles = new Set( files.map( normalizePackagePath ) )
	packageData.media.forEach( ( media, index ) => {
		if ( ! isPortablePackagePath( media.path ) ) {
			errors.push( createError(
				'invalid_path',
				`/media/${ index }/path`,
				`Media path must stay inside the package directory: ${ media.path }`
			) )
			return
		}

		const mediaPath = normalizePackagePath( media.path )
		if ( ! packageFiles.has( mediaPath ) ) {
			errors.push( createError(
				'missing_file',
				`/media/${ index }/path`,
				`Media file is missing from the package: ${ mediaPath }`
			) )
		}
	} )

	errors.push(
		...collectDuplicateErrors( packageData.pages.map( page => page.slug ), '/pages', 'Page slugs' ),
		...collectDuplicateErrors( packageData.media.map( media => media.id ), '/media', 'Media IDs' ),
		...collectDuplicateErrors( packageData.media.map( media => media.path ), '/media', 'Media paths' ),
		...collectDuplicateErrors( packageData.theme.templates.map( template => template.slug ), '/theme/templates', 'Template slugs' ),
		...collectDuplicateErrors( packageData.theme.templateParts.map( templatePart => templatePart.slug ), '/theme/templateParts', 'Template part slugs' ),
		...collectDuplicateErrors( packageData.menu.entities.map( entity => entity.slug ), '/menu/entities', 'Navigation entity slugs' ),
		...collectDuplicateErrors( packageData.patterns.map( pattern => pattern.slug ), '/patterns', 'Pattern slugs' ),
		...collectDuplicateErrors( packageData.plugins.map( plugin => plugin.slug ), '/plugins', 'Plugin slugs' ),
		...validateReferences( packageData ),
		...collectExternalMediaErrors( packageData )
	)

	const manifestPaths = new Set( packageData.media.map( media => normalizePackagePath( media.path ) ) )
	collectPackageMediaReferences( packageData ).forEach( mediaPath => {
		if ( ! manifestPaths.has( mediaPath ) ) {
			errors.push( createError(
				'unlisted_media_reference',
				'/',
				`Package media reference is not listed in the media manifest: ${ mediaPath }`
			) )
		}
	} )

	return errors
}

const listPackageEntries = ( packageDirectory, relativeDirectory = '' ) => {
	const directory = path.join( packageDirectory, relativeDirectory )
	return fs.readdirSync( directory, { withFileTypes: true } ).reduce( ( entries, entry ) => {
		const relativePath = path.posix.join( relativeDirectory, entry.name )
		if ( entry.isDirectory() ) {
			const nestedEntries = listPackageEntries( packageDirectory, relativePath )
			entries.files.push( ...nestedEntries.files )
			entries.unsafeFiles.push( ...nestedEntries.unsafeFiles )
			return entries
		}

		if ( entry.isSymbolicLink() ) {
			entries.unsafeFiles.push( relativePath )
			return entries
		}

		entries.files.push( relativePath )
		return entries
	}, { files: [], unsafeFiles: [] } )
}

const listPackageFiles = packageDirectory => listPackageEntries( packageDirectory ).files

const validatePackageDirectory = packageDirectory => {
	const resolvedDirectory = path.resolve( packageDirectory )
	const metaPath = path.join( resolvedDirectory, 'meta.json' )

	if ( ! fs.existsSync( metaPath ) ) {
		return [ createError( 'missing_meta', '/meta.json', 'Package does not contain meta.json.' ) ]
	}
	if ( fs.lstatSync( metaPath ).isSymbolicLink() ) {
		return [ createError( 'invalid_path', '/meta.json', 'Package files must not be symbolic links: meta.json' ) ]
	}

	let packageData
	try {
		packageData = JSON.parse( fs.readFileSync( metaPath, 'utf8' ) )
	} catch ( error ) {
		return [ createError( 'invalid_json', '/meta.json', error.message ) ]
	}

	const packageEntries = listPackageEntries( resolvedDirectory )
	return validateSiteKitPackage( packageData, {
		directorySlug: path.basename( resolvedDirectory ),
		files: packageEntries.files,
		unsafeFiles: packageEntries.unsafeFiles,
	} )
}

const runCli = args => {
	if ( args.length !== 1 ) {
		console.error( 'Usage: node tools/site-kits/validate-package.js <package-directory>' )
		return 2
	}

	const packageDirectory = path.resolve( args[ 0 ] )
	if ( ! fs.existsSync( packageDirectory ) || ! fs.statSync( packageDirectory ).isDirectory() ) {
		console.error( `Package directory does not exist: ${ packageDirectory }` )
		return 2
	}

	const errors = validatePackageDirectory( packageDirectory )
	if ( errors.length ) {
		errors.forEach( error => {
			console.error( `[${ error.code }] ${ error.path }: ${ error.message }` )
		} )
		return 1
	}

	console.log( `Valid Site Kit v${ SITE_KIT_VERSION } package: ${ packageDirectory }` )
	return 0
}

if ( require.main === module ) {
	process.exitCode = runCli( process.argv.slice( 2 ) )
}

module.exports = {
	SITE_KIT_VERSION,
	isPortablePackagePath,
	listPackageEntries,
	listPackageFiles,
	runCli,
	validatePackageDirectory,
	validateSiteKitPackage,
}
