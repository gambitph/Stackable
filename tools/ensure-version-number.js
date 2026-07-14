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
 * Also updates the Playwright matrix in GitHub workflow files so CI tests only
 * supported WordPress and PHP version combinations.
 */

const fs = require( 'fs' )
const replace = require( 'replace-in-file' )
const compareVersions = require( 'compare-versions' )
const {
	fetchWordPressReleases,
	subtractMinorVersions,
	syncPlaywrightTestMatrix,
} = require( './playwright-test-matrix' )

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

const main = async () => {
	const version = getVersion()
	const fullVersion = getFullVersion()
	await replaceConstant( fullVersion )
	await replaceReadmeStableTag( version )
	await replacePackageJson( version )

	let testedUpTo = getReadmeTestedUpTo()
	if ( ! testedUpTo ) {
		console.warn( 'Could not read Tested up to from readme.txt; skipping WordPress sync.' ) // eslint-disable-line
		return
	}

	let requiresPhp = getReadmeRequiresPhp()
	if ( ! requiresPhp ) {
		console.warn( 'Could not read Requires PHP from readme.txt; skipping WordPress sync.' ) // eslint-disable-line
		return
	}

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
	}
}

main().catch( err => {
	console.error( err ) // eslint-disable-line
	process.exit( 1 )
} )
