/**
 * Ensures that the Version number declared in the main plugin PHP file
 * is used for the STACKABLE_VERSION PHP constant and the
 * Stable tag in the readme file.
 *
 * Also syncs readme.txt "Tested up to" with the latest WordPress release from
 * api.wordpress.org (without downgrading), and sets "Requires at least" to
 * two minor versions below the effective tested version when the tested line updates.
 */

const fs = require( 'fs' )
const https = require( 'https' )
const replace = require( 'replace-in-file' )
const compareVersions = require( 'compare-versions' )

const WP_VERSION_CHECK_URL = 'https://api.wordpress.org/core/version-check/1.7/'

const getVersion = () => {
	const content = fs.readFileSync( 'plugin.php', 'utf8' )
	return content.match( /Version: ([\d.]+)/ )[ 1 ]
}

const getFullVersion = () => {
	const content = fs.readFileSync( 'plugin.php', 'utf8' )
	return content.match( /Version: ([\d\w-_.]+)/ )[ 1 ]
}

/**
 * @param {string} versionString e.g. "6.9.4" or "7.0"
 * @return {string} Version with the minor number reduced by 2 (WordPress-style carry).
 */
const subtractTwoMinorVersions = versionString => {
	const parts = versionString.split( '.' ).map( Number )
	let major = parts[ 0 ] || 0
	let minor = parts[ 1 ] || 0
	const patch = parts[ 2 ] || 0
	minor -= 2
	while ( minor < 0 ) {
		major -= 1
		minor += 10
	}
	if ( patch > 0 ) {
		return `${ major }.${ minor }.${ patch }`
	}
	return `${ major }.${ minor }`
}

const fetchLatestWordPressVersion = () => {
	return new Promise( ( resolve, reject ) => {
		const req = https.get( WP_VERSION_CHECK_URL, res => {
			let body = ''
			res.on( 'data', chunk => {
				body += chunk
			} )
			res.on( 'end', () => {
				try {
					const json = JSON.parse( body )
					const version = json.offers?.[ 0 ]?.version
					if ( ! version ) {
						reject( new Error( 'No version in WordPress API response' ) )
						return
					}
					resolve( version )
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

const getReadmeTestedUpTo = () => {
	const content = fs.readFileSync( 'readme.txt', 'utf8' )
	const m = content.match( /^Tested up to:\s*(\S+)/m )
	return m ? m[ 1 ] : null
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

const main = async () => {
	const version = getVersion()
	const fullVersion = getFullVersion()
	await replaceConstant( fullVersion )
	await replaceReadmeStableTag( version )
	await replacePackageJson( version )

	try {
		const latestWp = await fetchLatestWordPressVersion()
		const currentTested = getReadmeTestedUpTo()
		if ( ! currentTested ) {
			console.warn( 'Could not read Tested up to from readme.txt; skipping WordPress sync.' ) // eslint-disable-line
			return
		}
		// Only bump when the API reports a newer stable than readme (never downgrade).
		if ( compareVersions( latestWp, currentTested ) <= 0 ) {
			return
		}
		const requiresAtLeast = subtractTwoMinorVersions( latestWp )
		await replaceReadmeTestedAndRequires( latestWp, requiresAtLeast )
	} catch ( err ) {
		console.warn( `Skipped WordPress readme sync: ${ err.message }` ) // eslint-disable-line
	}
}

main().catch( err => {
	console.error( err ) // eslint-disable-line
	process.exit( 1 )
} )
