/**
 * Fixes strings from the Freemius SDK. This is so that we can freely update the
 * `freemius` folder whenever a new SDK version comes out, and then we won't
 * have to worry about changing the things uncustomizable things manually.
 *
 * We need this because some strings in the Freemius SDK isn't configurable.
 */

const replace = require( 'replace-in-file' )

const replaceDashboardUrl = () => {
	replace( {
		files: 'freemius/includes/class-freemius.php',
		from: 'href="https://users.freemius.com"',
		to: 'href="https://wpstackable.com/account/"',
	} ).then( changes => {
		if ( changes.length ) {
			console.log( `Updated Freemius dashboard to Stackable...` ) // eslint-disable-line
		}
	} )
}

replaceDashboardUrl()
