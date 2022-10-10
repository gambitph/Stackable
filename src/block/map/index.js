/**
 * BLOCK: Map Block.
 */

/**
 * External dependencies
 */
import { MapIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: MapIcon,
	attributes: schema,
	supports: {
		align: [ 'full', 'wide', 'center' ],
		anchor: true,
	},
	example,

	edit,
	save,
}
