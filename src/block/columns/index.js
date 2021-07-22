/**
 * BLOCK: Advanced Columns
 */
/**
 * External dependencies
 */
import { ColumnsIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * Internal dependencies
 */
import './auto-select'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'

export const name = 'ugb/columns'

export const settings = {
	title: __( 'Advanced Columns & Grid', i18n ),
	description: __( 'Add a block that displays content in multiple columns. Get advanced options on how you want your columns to look.', i18n ),
	icon: ColumnsIcon,
	category: 'layout',
	keywords: [
		__( 'Advanced Columns', i18n ),
		__( 'section rows', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	example,

	supports: {
		html: false,
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	edit,
	save,

	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.columns.custom-css.default', '' ),
		},
	},
}

// If the design was changed, check if we surpass the max columns.
addFilter( 'stackable.columns.setAttributes', 'stackable/columns/design', ( attributes, blockProps ) => {
	if ( typeof attributes.design === 'undefined' ) {
		return attributes
	}

	const blockAttributes = blockProps.attributes

	if ( attributes.design !== 'grid' && blockAttributes.columns > 6 ) {
		attributes.columns = 6
	}

	return attributes
} )

// If the design was changed, change the number of columns to make the layout's
// effect more apparent.
addFilter( 'stackable.columns.setAttributes', 'stackable/columns/design', ( attributes, blockProps ) => {
	if ( typeof attributes.design === 'undefined' ) {
		return attributes
	}

	const blockAttributes = blockProps.attributes

	if ( attributes.design !== 'plain' && blockAttributes.columns < 4 ) {
		attributes.columns = 4
	}

	return attributes
} )
