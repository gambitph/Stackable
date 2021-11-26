/**
 * Build script for google-fonts.json
 *
 * Downloads & generates list of Google Fonts.
 */

const path = require( 'path' )
const got = require( 'got' )
const jsonfile = require( 'jsonfile' )

const file = './google-fonts.json'

const createFontEntry = fontData => {
	return {
		family: fontData.family,
		variants: fontData.variants,
		subsets: fontData.subsets,
	}
}

( async () => {
	try {
		const response = await got( 'https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyDS1XfK5O1n2KXV3a1sonEffs966tQt54g', {
			responseType: 'json',
		} )

		const fonts = response.body.items.map( createFontEntry )
		const fullPath = path.resolve( __dirname, file )
		jsonfile.writeFile( fullPath, fonts, { spaces: 2, EOL: '\r\n' }, err => {
			if ( err ) {
					console.error( err ) // eslint-disable-line
			}
		} )

		console.log( `✔️  Sucessfully writen ${ file.match( /[^\/]+.json/ ) }` ) // eslint-disable-line
	} catch ( error ) {
		console.error( error.response.body ) // eslint-disable-line
	}
} )()
