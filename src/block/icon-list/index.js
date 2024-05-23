/**
 * External dependencies
 */
import { IconListIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import metadata from './block.json'
import schema from './schema'
import example from './example'
import deprecated from './deprecated'
import transforms from './transforms'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: IconListIcon,
	attributes: schema,
	supports: {
		anchor: true,
		spacing: true,
		__unstablePasteTextInline: true,
		__experimentalSelector: 'ol,ul',
		__experimentalOnMerge: true,
	},
	example,
	deprecated,
	edit,
	save,
	transforms,
}
