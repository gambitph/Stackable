const https = require( 'https' )
const fs = require( 'fs' )

const file = fs.createWriteStream( 'composer.phar' )
https.get( 'https://getcomposer.org/installer', function( response ) {
	response.pipe( file )
	console.log( `✔️  Sucessfully downloaded composer.phar` ) // eslint-disable-line
} )
