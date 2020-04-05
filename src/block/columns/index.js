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
import edit from './edit'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters, addFilter } from '@wordpress/hooks'
import { createResponsiveAttributes, createAllCombinationAttributes } from '~stackable/util'

export const schema = {
	design: {
		type: 'string',
		default: 'plain',
	},
	columns: {
		type: 'number',
		default: 2,
	},
	...createAllCombinationAttributes(
		'%sColumns%s', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet' ],
		[ '1', '2', '3', '4', '5', '6' ]
	),
	...createResponsiveAttributes( '%sHeight', {
		type: 'string',
		default: '',
	} ),
	...createResponsiveAttributes( '%sHeightNum', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sHeightNumUnit', {
		type: 'string',
		default: 'px',
	} ),
	collapsedRowGap: {
		type: 'number',
		default: '',
	},
	collapsedColumnsOrder: {
		type: 'string',
		default: '',
	},

	reverseColumns: {
		type: 'boolean',
		default: '',
	},
	...createResponsiveAttributes( '%sColumnGap', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sRowGap', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( '%sColumnVerticalAlign', {
		type: 'string',
		default: '',
	} ),

	// Text Colors
	...createAllCombinationAttributes(
		'%sColor', {
			type: 'string',
			default: '',
		},
		[ 'Heading', 'BodyText', 'Link', 'LinkHover' ]
	),
}

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

	supports: {
		html: false,
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	edit,
	save,

	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
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
