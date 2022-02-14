/**
 * BLOCK: Columns Block
 */
/**
 * External dependencies
 */
import { ColumnsIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import transforms from './transforms'
import variations from './variations'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const settings = applyFilters( 'stackable.block.metadata', {
	...metadata,
	icon: ColumnsIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkAlign: true,
		stkLayoutReset: false,
	},
	example,

	transforms,
	variations,
	edit,
	save,
} )

