/**
 * Gathers all the block deprecation tests, and compiles them into a single json file.
 */
const fs = require( 'fs' )
const path = require( 'path' )
const glob = require( 'glob' )

const file = './dist/dummy-block-registration.js'
const content = `/**
* This file is a dummy file that doesn't do anything except
* does a fake registration of every Stackable block so that
* the WordPress plugin directory detects them and lists them
* in the Stackable plugin page.
*
* This file is auto-generated from the build process.
*/
`

const isDeprecatedBlock = content => {
	return !! content.match( /inserter\s*:\s*false/g )
}

const getBlockName = content => {
	return ( content.match( /name\s*=\s*['"](.*?)['"]/ ) || [] )[ 1 ]
}

const getTitle = content => { // eslint-disable-line
	return ( content.match( /title\s*:.*?['"](.*?)['"]/ ) || [] )[ 1 ]
}

const getArgs = content => {
	return content.match( /settings = ({([\s\S]*?)$)/ )[ 1 ]
}

const registerBlocks = glob.sync( './src/block/*/index.js' ).reduce( ( code, file ) => {
	const content = fs.readFileSync( path.resolve( file ), 'utf8' )

	if ( isDeprecatedBlock( content ) ) {
		return code
	}

	const name = getBlockName( content )
	const args = getArgs( content )

	return `${ code }
registerBlockType( '${ name }', ${ args.trim() } )`
}, content )

fs.writeFile( file, registerBlocks, err => {
	if ( err ) {
		return console.log( err ) // eslint-disable-line
	}

	console.log( `✔️  Sucessfully writen dummy block registration script ${ file }` ) // eslint-disable-line
} )
