/**
 * BLOCK: Testimonial Block
 */
/**
 * Internal dependencies
 */
import variations from './variations'
import metadata from './block.json'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import deprecated from './deprecated'

/**
 * External dependencies
 */
import { TestimonialIcon } from '~stackable/icons'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export const settings = {
	...metadata,
	icon: TestimonialIcon,
	attributes: schema,
	supports: {
		anchor: true,
		html: false,
		align: true,
		stkAlign: true,
		stkDefaultTab: 'layout',
	},
	example,

	variations,
	deprecated,
	edit,
	save,
}
