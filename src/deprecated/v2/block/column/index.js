/**
 * BLOCK: Advanced Columns
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
import _metadata from './block.json'

/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	icon: ColumnsIcon,
	attributes: schema,

	supports: {
		inserter: false,
		reusable: false,
		html: false,
		anchor: true,
	},

	edit,
	save,

	modules: {
		'advanced-general': true,
		'advanced-block-spacing': {
			verticalAlign: false,
		},
		'advanced-column-spacing': {
			columnGap: false,
			paddings: false,
		},
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		// 'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'container-link': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.column.custom-css.default', '' ),
		},
	},
}
