/**
 * Updates the build type constant STACKABLE_BUILD in the main plugin file. This
 * constant is used to decide whether certain (premium) files are loaded.
 */

const path = require( 'path' )
const replace = require( 'replace-in-file' )

const replaceConstant = async build => {
	const changes = await replace( {
		files: path.resolve( __dirname, '../plugin.php' ),
		from: /define\((.*)?STACKABLE_BUILD(.*)?,(.*)?['"]?([a-zA-Z\d\-.])*['"]?(.*)?\)/,
		to: `define( 'STACKABLE_BUILD', '${ build }' )`,
	} )
	if ( changes.length ) {
		console.log( `Updated STACKABLE_BUILD const to ${ build }...` ) // eslint-disable-line
	}
}

replaceConstant( process.argv[ 2 ] || 'free' ).catch( error => {
	console.error( error ) // eslint-disable-line
	process.exit( 1 )
} )
