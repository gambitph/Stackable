/**
 * BLOCK: Divider Block.
 */

/**
 * External dependencies
 */
import { disabledBlocks, i18n } from 'stackable'
import { DividerIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import edit from './edit'
import save from './save'
import deprecated from './deprecated'

/**
 * WordPress dependencies
 */
import { addFilter, applyFilters } from '@wordpress/hooks'
import { __ } from '@wordpress/i18n'

const schema = {
	design: {
		type: 'string',
		default: 'basic',
	},
	color: {
		type: 'string',
		default: '',
	},
	hrMarginTop: {
		type: 'number',
		default: '',
	},
	hrMarginBottom: {
		type: 'number',
		default: '',
	},
	height: {
		default: '',
		type: 'number',
	},
	width: {
		default: '',
		type: 'number',
	},
	alignment: {
		type: 'string',
		default: 'center',
	},
}

export const name = 'ugb/divider'

export const settings = {
	title: __( 'Divider', i18n ),
	description: __( 'Add a pause between your content.', i18n ),
	icon: DividerIcon,
	category: 'stackable',
	keywords: [
		__( 'Divider', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	edit,
	save,
	deprecated,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		'advanced-responsive': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.divider.custom-css.default', '' ),
		},
	},
}

addFilter( 'stackable.divider.setAttributes', 'stackable/divider/defaults', ( attributes, blockProps ) => {
	const blockAttributes = blockProps.attributes

	if ( typeof attributes.design !== 'undefined' && attributes.design !== 'basic' ) {
		return {
			...attributes,
			height: attributes.design === 'asterisks' ? 14 : 7,
			width: attributes.design === 'dots' || attributes.design === 'asterisks' ? 10 : blockAttributes.width,
		}
	} else if ( attributes.design === 'basic' ) {
		return {
			...attributes,
			height: 1,
			width: 50,
		}
	}

	return attributes
} )
