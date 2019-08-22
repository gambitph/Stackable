/**
 * Build script for google-fonts.json
 *
 * Downloads & generates list of Google Fonts.
 */

const path = require( 'path' )
const request = require( 'request' )
const jsonfile = require( 'jsonfile' )

const file = './google-fonts.json'

const createFontEntry = fontData => {
	return {
		family: fontData.family,
		variants: fontData.variants,
		subsets: fontData.subsets,
	}
}

request( 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDS1XfK5O1n2KXV3a1sonEffs966tQt54g',
	{ json: true },
	( err, res, body ) => {
		if ( err ) {
			return console.log( err ) // eslint-disable-line
		}

		const fonts = body.items.map( createFontEntry )
		const fullPath = path.resolve( __dirname, file )
		jsonfile.writeFile( fullPath, fonts, { spaces: 2, EOL: '\r\n' }, err => {
			if ( err ) {
				console.error( err ) // eslint-disable-line
			}
		} )

		console.log( `✔️  Sucessfully writen ${ file.match( /[^\/]+.json/ ) }` ) // eslint-disable-line
	}
)
