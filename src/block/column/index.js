/**
 * BLOCK: Advanced Columns
 */
/**
 * External dependencies
 */
import { ColumnsIcon } from '~stackable/icons'
import { i18n } from 'stackable'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import schema from './schema'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const name = 'ugb/column'

export const settings = {
	title: __( 'Advanced Column', i18n ),
	description: __( 'A single column within an advanced columns block. Get advanced options on how you want your column to look.', i18n ),
	icon: ColumnsIcon,
	parent: [ 'ugb/columns' ],
	category: 'layout',
	keywords: [
		__( 'Advanced Columns', i18n ),
		__( 'section rows', i18n ),
		__( 'Stackable', i18n ),
	],
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
		'advanced-responsive': true,
		// 'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'clickable-container': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.column.custom-css.default', '' ),
		},
	},
}
