/**
 * Copies the welcome videos to the dist folder.
 */

const fs = require( 'fs' )
const glob = require( 'glob' )
const path = require( 'path' )

// Create folder if it doesn't exist yet.
fs.mkdir( path.resolve( './dist/videos/welcome/' ), { recursive: true }, err => {
	if ( err ) {
		throw err
	}

	glob.sync( path.resolve( __dirname, './videos/*.mp4' ) ).forEach( video => {
		const dest = './dist/videos/welcome/' + path.basename( video )
		const destAbs = path.resolve( `./dist/videos/welcome/${ path.basename( video ) }` )

		fs.copyFile( video, destAbs, err => {
			if ( err ) {
				throw err
			}
			console.log( `✔️  Sucessfully writen ${ dest }` ) // eslint-disable-line
		} )
	} )
} )
