/**
 * This is the file that Webpack is compiling into editor_blocks.js
 */
/**
 * Internal dependencies
 */
import './fontawesome'
import './debug-sidebar'
import './format-types'

/**
 * External dependencies
 */
import registerBlock from '~stackable/register-block'

// Import all index.js and register all the blocks found (if name & settings are exported by the script)
const importAllAndRegister = r => {
	r.keys().forEach( key => {
		const { name, settings } = r( key )
		// TODO: remove try block & register right away.
		try {
			return name && settings && registerBlock( name, settings )
		} catch ( error ) {
			console.error( `${ name } needs to be converted` ) // eslint-disable-line
		}
	} )
}

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
