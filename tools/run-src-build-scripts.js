/**
 * Runs all build.js files found in the source files.
 */

const childProcess = require( 'child_process' )
const path = require( 'path' )
const glob = require( 'glob' )

const log = file => {
	const displayFile = file.replace( /\/build.js/, '' ).replace( /^(.*?)src\//, '' )
	console.log( `✔️  Sucessfully run build file ${ displayFile }` ) // eslint-disable-line
}

glob.sync( './src/block/**/build.js' ).forEach( file => {
	childProcess.fork( path.resolve( file ) )
	log( file )
} )
glob.sync( './src/components/**/build.js' ).forEach( file => {
	childProcess.fork( path.resolve( file ) )
	log( file )
} )
