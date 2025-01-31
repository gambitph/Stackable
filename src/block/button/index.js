/**
 * BLOCK: Button Block
 */
/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import example from './example'
import schema from './schema'
import metadata from './block.json'
import transforms from './transforms'
import deprecated from './deprecated'
import substitute from './substitute'

/**
 * External dependencies
 */
import { ButtonIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: ButtonIcon,
	attributes: schema,
	supports: {
		anchor: true,
		splitting: true,
	},
	transforms,

	deprecated,
	example,
	edit,
	save,
	substitute,
}
