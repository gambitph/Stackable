/**
 * This is the file that Webpack is compiling into editor_blocks_deprecated_v2.js
 */

/**
 * Internal dependencies
 */
import './plugins'
import './design-library'
import { SVGStackableCategoryIcon } from '../../icons'

/**
 * External dependencies
 */
import registerBlock from './register-block'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	getCategories, setCategories,
} from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'

// Register our category. Not a collection since our v2 blocks would appear as "Uncategorized"
setCategories( [
	...getCategories(),
	{
		slug: 'stackable-v2',
		title: __( 'Stackable', i18n ) + ' (v2)',
		icon: SVGStackableCategoryIcon,
	},
] )

// Import all index.js and register all the blocks found (if name & settings are exported by the script)
const importAllAndRegister = r => {
	r.keys().forEach( key => {
		const { name, settings } = r( key )
		if ( name ) {
			try {
				return name && settings && registerBlock( name, settings )
			} catch ( error ) {
				console.error(`Could not register ${name} block`); // eslint-disable-line
			}
		}
	} )
}

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
