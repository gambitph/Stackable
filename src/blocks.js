/**
 * This is the file that Webpack is compiling into editor_blocks.js
 */
/**
 * Internal dependencies
 */
import './format-types'
import './plugins'
import './compatibility'
import './disabled-blocks'

/**
 * External dependencies
 */
import { i18n } from 'stackable'
import {
	addStackableBlockCategory,
	registerBlockType,
} from '~stackable/util'
import { withVisualGuideContext } from '~stackable/higher-order'

/**
 * WordPress dependencies
 */
import { getBlockType } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

// Register our block category.
addStackableBlockCategory()

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

		// Register the block if it's not already registered and not disabled.
		if ( ! getBlockType( name ) ) {
			registerBlockType( name, settings )
		}
	} )
}

// Add some HOCs that should be applied to all our blocks.
addFilter( 'stackable.registerBlockType.edit', 'stackable', edit => {
	// This allows controls to show highlighted areas in the block.
	return withVisualGuideContext( edit )
} )

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
