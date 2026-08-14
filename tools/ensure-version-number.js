/**
 * Ensures that the Version number declared in the main plugin PHP file
 * is used for the STACKABLE_VERSION PHP constant and the
 * Stable tag in the readme file.
 *
 * Also syncs readme.txt "Tested up to" with the latest WordPress release from
 * api.wordpress.org (without downgrading), and sets "Requires at least" to
 * two minor versions below the effective tested version when the tested line updates.
 *
 * Also syncs readme.txt "Requires PHP" with the latest WordPress release minimum
 * PHP requirement from the API (without downgrading).
 *
 * After the PHP floor is known, rewrites plugin.php version_compare literals
 * and notice strings, phpcs.xml.dist testVersion (free and premium), and the
 * Playwright min-PHP matrix cell so they stay aligned with readme.txt.
 */

const fs = require( 'fs' )
const replace = require( 'replace-in-file' )
const compareVersions = require( 'compare-versions' )
const {
	fetchWordPressReleases,
	getMinorKey,
	subtractMinorVersions,
	syncPlaywrightTestMatrix,
} = require( './playwright-test-matrix' )

const PLUGIN_PHP_PATH = 'plugin.php'
const PHPCS_XML_PATHS = [
	'phpcs.xml.dist',
	'pro__premium_only/phpcs.xml.dist',
]
const PHPCS_TESTVERSION_START = '<!-- stackable-phpcompat-testversion-start -->'
const PHPCS_TESTVERSION_END = '<!-- stackable-phpcompat-testversion-end -->'

const getVersion = () => {
	const content = fs.readFileSync( 'plugin.php', 'utf8' )
	return content.match( /Version: ([\d.]+)/ )[ 1 ]
}

const getFullVersion = () => {
	const content = fs.readFileSync( 'plugin.php', 'utf8' )
	return content.match( /Version: ([\d\w-_.]+)/ )[ 1 ]
}

const getReadmeTestedUpTo = () => {
	const content = fs.readFileSync( 'readme.txt', 'utf8' )
	const m = content.match( /^Tested up to:\s*(\S+)/m )
	return m ? m[ 1 ] : null
}

const getReadmeRequiresPhp = () => {
	const content = fs.readFileSync( 'readme.txt', 'utf8' )
	const m = content.match( /^Requires PHP:\s*(\S+)/m )
	return m ? m[ 1 ] : null
}

/**
 * @param {string} requiresPhp Readme "Requires PHP" value, e.g. "7.4"
 * @return {string} Three-part version for PHP version_compare, e.g. "7.4.0"
 */
const toPhpCompareVersion = requiresPhp => {
	const parts = String( requiresPhp ).split( '.' )
	while ( parts.length < 3 ) {
		parts.push( '0' )
	}
	return parts.join( '.' )
}

/**
 * @param {string} requiresPhp Readme "Requires PHP" value, e.g. "7.4"
 * @return {string} PHPCompatibility testVersion, e.g. "7.4-"
 */
const toPhpcsTestVersion = requiresPhp => `${ getMinorKey( requiresPhp ) }-`

/**
 * @param {string} content plugin.php contents
 * @param {string} phpCompareVersion e.g. "7.4.0"
 * @return {string} Updated contents
 */
const applyPluginPhpMinimum = ( content, phpCompareVersion ) => {
	let next = content.replace(
		/version_compare\(\s*PHP_VERSION,\s*'[\d.]+',\s*'<'\s*\)/g,
		`version_compare( PHP_VERSION, '${ phpCompareVersion }', '<' )`
	)
	next = next.replace(
		/PHP version [\d.]+ or higher/g,
		`PHP version ${ phpCompareVersion } or higher`
	)
	return next
}

/**
 * @param {string} content phpcs.xml.dist contents
 * @param {string} testVersion e.g. "7.4-"
 * @return {string} Updated contents
 */
const applyPhpcsTestVersion = ( content, testVersion ) => {
	const start = PHPCS_TESTVERSION_START.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' )
	const end = PHPCS_TESTVERSION_END.replace( /[.*+?^${}()|[\]\\]/g, '\\$&' )
	return content.replace(
		new RegExp( `(${ start }\\n)[\\s\\S]*?(\\n\\s*${ end })` ),
		`$1	<config name="testVersion" value="${ testVersion }"/>$2`
	)
}

const replaceConstant = async version => {
	const changes = await replace( {
		files: 'plugin.php',
		from: /define\((.*)?STACKABLE_VERSION(.*)?,(.*)?['"]?([a-zA-Z\d-.])*['"]?(.*)?\)/,
		to: `define( 'STACKABLE_VERSION', '${ version }' )`,
	} )
	if ( changes.length ) {
		console.log( `Bumped STACKABLE_VERSION number to ${ version }...` ) // eslint-disable-line
	}
}

const replaceReadmeStableTag = async version => {
	const changes = await replace( {
		files: 'readme.txt',
		from: /Stable tag: ([\S]+)/,
		to: `Stable tag: ${ version }`,
	} )
	if ( changes.length ) {
		console.log( `Bumped Stable tag number to ${ version }...` ) // eslint-disable-line
	}
}

const replacePackageJson = async version => {
	const changes = await replace( {
		files: 'package.json',
		from: /"version": "([\S]+)"/,
		to: `"version": "${ version }"`,
	} )
	if ( changes.length ) {
		console.log( `Bumped package version number to ${ version }...` ) // eslint-disable-line
	}
}

const replaceReadmeTestedAndRequires = async ( testedVersion, requiresAtLeast ) => {
	const testedChanges = await replace( {
		files: 'readme.txt',
		from: /^Tested up to:\s*(\S+)/m,
		to: `Tested up to: ${ testedVersion }`,
	} )
	const requiresChanges = await replace( {
		files: 'readme.txt',
		from: /^Requires at least:\s*(\S+)/m,
		to: `Requires at least: ${ requiresAtLeast }`,
	} )
	if ( testedChanges.length ) {
		console.log( `Updated Tested up to: ${ testedVersion }...` ) // eslint-disable-line
	}
	if ( requiresChanges.length ) {
		console.log( `Updated Requires at least: ${ requiresAtLeast }...` ) // eslint-disable-line
	}
}

const replaceReadmeRequiresPhp = async requiresPhp => {
	const changes = await replace( {
		files: 'readme.txt',
		from: /^Requires PHP:\s*(\S+)/m,
		to: `Requires PHP: ${ requiresPhp }`,
	} )
	if ( changes.length ) {
		console.log( `Updated Requires PHP: ${ requiresPhp }...` ) // eslint-disable-line
	}
}

const syncPluginPhpMinimum = requiresPhp => {
	if ( ! fs.existsSync( PLUGIN_PHP_PATH ) ) {
		return false
	}
	const phpCompareVersion = toPhpCompareVersion( requiresPhp )
	const existing = fs.readFileSync( PLUGIN_PHP_PATH, 'utf8' )
	const next = applyPluginPhpMinimum( existing, phpCompareVersion )
	if ( existing === next ) {
		return false
	}
	fs.writeFileSync( PLUGIN_PHP_PATH, next )
	console.log( `Updated plugin.php PHP minimum to ${ phpCompareVersion }...` ) // eslint-disable-line
	return true
}

const syncPhpcsTestVersion = requiresPhp => {
	const testVersion = toPhpcsTestVersion( requiresPhp )
	const updatedPaths = PHPCS_XML_PATHS.filter( phpcsXmlPath => {
		if ( ! fs.existsSync( phpcsXmlPath ) ) {
			return false
		}
		const existing = fs.readFileSync( phpcsXmlPath, 'utf8' )
		const next = applyPhpcsTestVersion( existing, testVersion )
		if ( existing === next ) {
			return false
		}
		fs.writeFileSync( phpcsXmlPath, next )
		return true
	} )
	if ( updatedPaths.length ) {
		console.log( `Updated phpcs testVersion to ${ testVersion }...` ) // eslint-disable-line
		updatedPaths.forEach( phpcsXmlPath => {
			console.log( `  ${ phpcsXmlPath }` ) // eslint-disable-line
		} )
	}
	return updatedPaths.length > 0
}

const syncPhpFloorFromReadme = requiresPhp => {
	syncPluginPhpMinimum( requiresPhp )
	syncPhpcsTestVersion( requiresPhp )
}

const main = async () => {
	const version = getVersion()
	const fullVersion = getFullVersion()
	await replaceConstant( fullVersion )
	await replaceReadmeStableTag( version )
	await replacePackageJson( version )

	let testedUpTo = getReadmeTestedUpTo()
	let requiresPhp = getReadmeRequiresPhp()

	if ( ! testedUpTo ) {
		console.warn( 'Could not read Tested up to from readme.txt; skipping WordPress version sync.' ) // eslint-disable-line
	}
	if ( ! requiresPhp ) {
		console.warn( 'Could not read Requires PHP from readme.txt; skipping PHP floor sync.' ) // eslint-disable-line
	}

	if ( testedUpTo && requiresPhp ) {
		try {
			const releases = await fetchWordPressReleases()
			const latestRelease = releases[ 0 ]
			const latestWp = latestRelease.version
			const latestMinPhp = latestRelease.phpVersion

			// Only bump when the API reports a newer stable than readme (never downgrade).
			if ( compareVersions( latestWp, testedUpTo ) > 0 ) {
				const requiresAtLeast = subtractMinorVersions( latestWp, 2 )
				await replaceReadmeTestedAndRequires( latestWp, requiresAtLeast )
				testedUpTo = latestWp
			}

			// Only bump when the latest WordPress release requires a higher PHP (never downgrade).
			if ( compareVersions( latestMinPhp, requiresPhp ) > 0 ) {
				await replaceReadmeRequiresPhp( latestMinPhp )
				requiresPhp = latestMinPhp
			}

			await syncPlaywrightTestMatrix( {
				testedUpTo,
				minPhp: requiresPhp,
				releases,
			} )
		} catch ( err ) {
			console.warn( `Skipped WordPress readme sync: ${ err.message }` ) // eslint-disable-line
			requiresPhp = getReadmeRequiresPhp()
		}
	}

	if ( requiresPhp ) {
		syncPhpFloorFromReadme( requiresPhp )
	}
}

main().catch( err => {
	console.error( err ) // eslint-disable-line
	process.exit( 1 )
} )
