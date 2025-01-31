/**
 * BLOCK: Button Block
 */
/**
 * External dependencies
 */
import { ButtonGroupIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'
import metadata from './block.json'
import variations from './variations'
import deprecated from './deprecated'
import { buttonExample } from './example'
import substitute from './substitute'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ButtonGroupIcon,
	attributes: schema,
	supports: {
		anchor: true,
		align: [ 'center', 'wide', 'full' ],
		stkLayoutReset: false,
		stkSaveBlockStyle: false,
		stkDefaultTab: 'layout',
		spacing: true,
	},
	variations,
	deprecated,

	example: buttonExample,
	edit,
	save,
	substitute,
}
