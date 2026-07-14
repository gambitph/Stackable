/* eslint-disable camelcase */
/**
 * Builds the Playwright CI matrix from Stackable's supported WordPress versions
 * (Tested up to + two minors below) and matching PHP versions.
 *
 * WP versions and min PHP are resolved from api.wordpress.org.
 * Max PHP for latest WP is hardcoded until WordPress exposes it via API.
 *
 * The matrix is written directly into GitHub workflow files between marker comments.
 */

const fs = require( 'fs' )
const https = require( 'https' )
const compareVersions = require( 'compare-versions' )

const WP_VERSION_CHECK_URL = 'https://api.wordpress.org/core/version-check/1.7/'
const PLAYWRIGHT_MATRIX_START = '# stackable-playwright-matrix-start'
const PLAYWRIGHT_MATRIX_END = '# stackable-playwright-matrix-end'

const PLAYWRIGHT_WORKFLOW_PATHS = [
	'.github/workflows/playwright.yml',
	'pro__premium_only/.github/workflows/playwright.yml',
]

/**
 * Highest fully supported PHP for the latest WordPress release.
 * Update when WordPress documents new max PHP support (make.wordpress.org/core).
 */
const LATEST_WP_MAX_PHP = '8.5'

/**
 * Normalize API values like "7.2.24" to wp-env/readme form "7.2".
 *
 * @param {string} phpVersion
 * @return {string} Normalized PHP version
 */
const normalizePhpVersion = phpVersion => {
	const parts = phpVersion.split( '.' )
	if ( parts.length >= 2 ) {
		return `${ parts[ 0 ] }.${ parts[ 1 ] }`
	}
	return phpVersion
}

const fetchWordPressReleases = () => {
	return new Promise( ( resolve, reject ) => {
		const req = https.get( WP_VERSION_CHECK_URL, res => {
			let body = ''
			res.on( 'data', chunk => {
				body += chunk
			} )
			res.on( 'end', () => {
				try {
					const json = JSON.parse( body )
					const releases = json.offers
						?.filter( offer => offer.version )
						.map( offer => ( {
							version: offer.version,
							phpVersion: normalizePhpVersion( offer.php_version || '7.2' ),
						} ) )
					if ( ! releases?.length ) {
						reject( new Error( 'No versions in WordPress API response' ) )
						return
					}
					resolve( releases )
				} catch ( err ) {
					reject( err )
				}
			} )
		} )
		req.setTimeout( 15000, () => {
			req.destroy()
			reject( new Error( 'WordPress version check request timed out' ) )
		} )
		req.on( 'error', reject )
	} )
}

const fetchLatestWordPressRelease = async () => {
	const releases = await fetchWordPressReleases()
	return releases[ 0 ]
}

/**
 * @param {string} versionString e.g. "6.9.4" or "7.0"
 * @param {number} count Minor versions to subtract.
 * @return {string} Subtracted version string
 */
const subtractMinorVersions = ( versionString, count ) => {
	const parts = versionString.split( '.' ).map( Number )
	let major = parts[ 0 ] || 0
	let minor = parts[ 1 ] || 0
	const patch = parts[ 2 ] || 0
	minor -= count
	while ( minor < 0 ) {
		major -= 1
		minor += 10
	}
	if ( patch > 0 ) {
		return `${ major }.${ minor }.${ patch }`
	}
	return `${ major }.${ minor }`
}

const getMinorKey = versionString => {
	const parts = versionString.split( '.' )
	return `${ parts[ 0 ] }.${ parts[ 1 ] || 0 }`
}

const resolveLatestWordPressPatch = ( versionString, releases ) => {
	const minorKey = getMinorKey( versionString )
	const matches = releases.filter( release => getMinorKey( release.version ) === minorKey )
	if ( ! matches.length ) {
		return versionString
	}
	return matches.sort( ( a, b ) => compareVersions( b.version, a.version ) )[ 0 ].version
}

/**
 * @param {Object} options
 * @param {string} options.testedUpTo Readme "Tested up to" value (synced from WP API during build).
 * @param {string} options.minPhp Minimum PHP from latest WordPress API release.
 * @param {Array<{ version: string, phpVersion: string }>} options.releases WordPress releases from the API.
 * @return {{ include: Array<{ php_version: string, wp_version: string }> }} Playwright test matrix
 */
const buildPlaywrightMatrix = ( {
	testedUpTo, minPhp, releases,
} ) => {
	const supportedVersions = [
		subtractMinorVersions( testedUpTo, 2 ),
		subtractMinorVersions( testedUpTo, 1 ),
		testedUpTo,
	].map( version => resolveLatestWordPressPatch( version, releases ) )

	const latestWp = supportedVersions[ 2 ]

	const include = [
		{
			php_version: LATEST_WP_MAX_PHP,
			wp_version: latestWp,
		},
		{
			php_version: minPhp,
			wp_version: latestWp,
		},
	]

	for ( let i = 0; i < 2; i++ ) {
		include.push( {
			php_version: minPhp,
			wp_version: supportedVersions[ i ],
		} )
	}

	return { include }
}

const formatMatrixIncludeYaml = include => {
	return include.map( entry =>
		`          - php_version: '${ entry.php_version }'\n            wp_version: '${ entry.wp_version }'`
	).join( '\n' )
}

const replaceMatrixInWorkflow = ( content, matrix ) => {
	const block = formatMatrixIncludeYaml( matrix.include )
	return content.replace(
		/(# stackable-playwright-matrix-start\n)[\s\S]*?(\n\s*# stackable-playwright-matrix-end)/,
		`$1${ block }$2`
	)
}

const syncPlaywrightWorkflowFile = ( workflowPath, matrix ) => {
	if ( ! fs.existsSync( workflowPath ) ) {
		return false
	}

	const existing = fs.readFileSync( workflowPath, 'utf8' )
	const next = replaceMatrixInWorkflow( existing, matrix )

	if ( existing === next ) {
		return false
	}

	fs.writeFileSync( workflowPath, next )
	return true
}

const syncPlaywrightTestMatrix = async ( {
	testedUpTo, minPhp, releases,
} ) => {
	const resolvedReleases = releases || await fetchWordPressReleases()
	const matrix = buildPlaywrightMatrix( {
		testedUpTo,
		minPhp,
		releases: resolvedReleases,
	} )

	const updatedPaths = PLAYWRIGHT_WORKFLOW_PATHS.filter( workflowPath =>
		syncPlaywrightWorkflowFile( workflowPath, matrix )
	)

	if ( updatedPaths.length ) {
		console.log( `Updated Playwright test matrix (${ matrix.include.length } jobs)...` ) // eslint-disable-line
		matrix.include.forEach( entry => {
			console.log( `  PHP ${ entry.php_version } / WP ${ entry.wp_version }` ) // eslint-disable-line
		} )
		updatedPaths.forEach( workflowPath => {
			console.log( `  ${ workflowPath }` ) // eslint-disable-line
		} )
	}

	return matrix
}

module.exports = {
	LATEST_WP_MAX_PHP,
	PLAYWRIGHT_MATRIX_END,
	PLAYWRIGHT_MATRIX_START,
	PLAYWRIGHT_WORKFLOW_PATHS,
	buildPlaywrightMatrix,
	fetchLatestWordPressRelease,
	fetchWordPressReleases,
	formatMatrixIncludeYaml,
	getMinorKey,
	normalizePhpVersion,
	replaceMatrixInWorkflow,
	resolveLatestWordPressPatch,
	subtractMinorVersions,
	syncPlaywrightTestMatrix,
	syncPlaywrightWorkflowFile,
}
