/**
 * Ensures that the CloudFront domain declared in the main plugin PHP file
 * is used for the STACKABLE_CLOUDFRONT_URL PHP constant and
 * for the URLs of various assets in production build.
 */

const fs = require( 'fs' )
const replace = require( 'replace-in-file' )

const getDomain = () => {
	const content = fs.readFileSync( 'package.json', 'utf8' )
	return JSON.parse( content ).cloudfront.domain
}

const replaceConstant = domain => {
	replace( {
		files: 'plugin.php',
		from: /define\((.*)?STACKABLE_CLOUDFRONT_URL(.*)?,(.*)?['"]?([a-zA-Z\d\-.:/])*['"]?(.*)?\)/,
		to: `define( 'STACKABLE_CLOUDFRONT_URL', 'https://${ domain }' )`,
	} ).then( changes => {
		if ( changes.length ) {
			console.log( `Updated CLOUDFRONT_URL to ${ domain }...` ) // eslint-disable-line
		}
	} )
}

const domain = getDomain()
replaceConstant( domain )
