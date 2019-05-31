/**
 * Ensures that the Version number declared in the main plugin PHP file
 * is used for the STACKABLE_VERSION PHP constant and the
 * Stable tag in the readme file.
 */

const fs = require( 'fs' )
const replace = require( 'replace-in-file' )

const getVersion = () => {
	const content = fs.readFileSync( 'plugin.php', 'utf8' )
	return content.match( /Version: ([\d.]+)/ )[ 1 ]
}

const getFullVersion = () => {
	const content = fs.readFileSync( 'plugin.php', 'utf8' )
	return content.match( /Version: ([\d\w-_.]+)/ )[ 1 ]
}

const replaceConstant = version => {
	replace( {
		files: 'plugin.php',
		from: /define\((.*)?STACKABLE_VERSION(.*)?,(.*)?['"]?([a-zA-Z\d\-.])*['"]?(.*)?\)/,
		to: `define( 'STACKABLE_VERSION', '${ version }' )`,
	} ).then( changes => {
		if ( changes.length ) {
			console.log( `Bumped STACKABLE_VERSION number to ${ version }...` ) // eslint-disable-line
		}
	} )
}

const replaceReadme = version => {
	replace( {
		files: 'readme.txt',
		from: /Stable tag: ([\S]+)/,
		to: `Stable tag: ${ version }`,
	} ).then( changes => {
		if ( changes.length ) {
			console.log( `Bumped Stable tag number to ${ version }...` ) // eslint-disable-line
		}
	} )
}

const replacePackageJson = version => {
	replace( {
		files: 'package.json',
		from: /"version": "([\S]+)"/,
		to: `"version": "${ version }"`,
	} ).then( changes => {
		if ( changes.length ) {
			console.log( `Bumped package version number to ${ version }...` ) // eslint-disable-line
		}
	} )
}

const version = getVersion()
const fullVersion = getFullVersion()
replaceConstant( fullVersion )
replaceReadme( version )
replacePackageJson( version )
