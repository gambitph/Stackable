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
import deprecated from './deprecated'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ColumnsIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkAlign: true,
		stkLayoutReset: false,
		stkSaveBlockStyle: false,
		stkDefaultTab: 'layout',
		spacing: true,
	},
	example,
	deprecated,

	transforms,
	variations,
	edit,
	save,
}
