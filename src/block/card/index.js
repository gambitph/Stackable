/**
 * BLOCK: Card Block.
 */

/**
 * External dependencies
 */
import { CardIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'
import deprecated from './deprecated'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: CardIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: true,
	},
	example,
	deprecated,
	//  styles: blockStyles,

	// deprecated,
	edit,
	save,
} )
