/**
 * This is the file that Webpack is compiling into editor_blocks.js
 */

/**
 * Internal dependencies
 */
import './format-types'
import './plugins'
import './help'
import './compatibility'
import './disabled-blocks'
import { SVGStackableCategoryIcon } from './icons'

/**
 * External dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import {
	registerBlockCollection, getBlockType, registerBlockType,
} from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'

// Register our block collection.
registerBlockCollection( 'stackable', {
	title: __( 'Stackable', i18n ),
	icon: SVGStackableCategoryIcon,
} )

// Register all the blocks found
const importAllAndRegister = r => {
	r.keys().forEach( key => {
		const { settings } = r( key )
		const { name } = settings

		// Register the block.
		if ( ! getBlockType( name ) ) {
			registerBlockType( name, applyFilters( `stackable.${ name }.settings`, settings ) )
		}
	} )
}

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
