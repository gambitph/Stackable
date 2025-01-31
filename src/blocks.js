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
import {
	i18n,
	settings as stackableSettings,
} from 'stackable'
import {
	addStackableBlockCategory,
	registerBlockType,
	BLOCK_STATE,
} from '~stackable/util'
import { withVisualGuideContext } from '~stackable/higher-order'
import { omit } from 'lodash'

/**
 * WordPress dependencies
 */
import { getBlockType } from '@wordpress/blocks'
import { __ } from '@wordpress/i18n'
import { addFilter } from '@wordpress/hooks'

// Register our block category.
addStackableBlockCategory()

// Fetch all substitution rules before registering
const fetchSubstitutionRules = r => {
	const substitutionRules = {}
	r.keys().forEach( key => {
		const { substitute } = r( key )
		if ( ! substitute ) {
			return
		}
		substitutionRules[ substitute.from ] = omit( substitute, 'from' )
	} )
	return substitutionRules
}

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
			// Register the block if the block is not disabled.
			if ( ! ( ( settings[ 'stk-block-dependency' ] in stackableSettings.stackable_block_states &&
				stackableSettings.stackable_block_states[ settings[ 'stk-block-dependency' ] ] === BLOCK_STATE.DISABLED ) ||
				stackableSettings.stackable_block_states[ name ] === BLOCK_STATE.DISABLED
			) ) {
				registerBlockType( name, settings )
			}
		}
	} )
}

// Add some HOCs that should be applied to all our blocks.
addFilter( 'stackable.registerBlockType.edit', 'stackable', edit => {
	// This allows controls to show highlighted areas in the block.
	return withVisualGuideContext( edit )
} )

export const substitutionRules = fetchSubstitutionRules( require.context( './block', true, /substitute\.js$/ ) )

importAllAndRegister( require.context( './block', true, /index\.js$/ ) )
