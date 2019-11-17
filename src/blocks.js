/**
 * This is the file that Webpack is compiling into editor_blocks.js
 */
/**
 * Internal dependencies
 */
import './fontawesome'
import './format-types'
import './plugins'

/**
 * External dependencies
 */
import registerBlock from '~stackable/register-block'

// Import all index.js and register all the blocks found (if name & settings are exported by the script)
const importAllAndRegister = r => {
	r.keys().forEach( key => {
		const { name, settings } = r( key )
		try {
			return name && settings && registerBlock( name, settings )
		} catch ( error ) {
			console.error( `Could not register ${ name } block` ) // eslint-disable-line
		}
	} )
}

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
