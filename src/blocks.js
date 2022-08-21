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
	getBlockType,
	registerBlockType,
	getCategories,
	setCategories,
} from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'

// Register our category. Not a collection since our blocks would appear as "Uncategorized"
setCategories( [
	...getCategories(),
	{
		slug: 'stackable',
		title: __( 'Stackable', i18n ),
		icon: SVGStackableCategoryIcon,
	},
] )

// Register all the blocks found
const importAllAndRegister = r => {
	r.keys().forEach( key => {
		const { settings } = r( key )
		if ( ! settings ) {
			return
		}
		const { name } = settings

		// Labels of the block aren't translated automatically by WordPress, we need to manually do this.
		// @see https://github.com/WordPress/gutenberg/issues/23636
		settings.title = __( settings.title, i18n ) // eslint-disable-line @wordpress/i18n-no-variables
		if ( settings.description ) {
			settings.description = __( settings.description, i18n ) // eslint-disable-line @wordpress/i18n-no-variables
		}
		if ( settings.keywords ) {
			settings.keywords = settings.keywords.map( keyword => __( keyword, i18n ) ) // eslint-disable-line @wordpress/i18n-no-variables
		}

		// Register the block.
		if ( ! getBlockType( name ) ) {
			registerBlockType( name, applyFilters( `stackable.${ name }.settings`, settings ) )
		}
	} )
}

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
