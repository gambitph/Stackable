/**
 * BLOCK: Blockquote
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * External dependencies
 */
import {
	createBackgroundAttributes,
	descriptionPlaceholder,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createResponsiveAttributes,
} from '~stackable/util'
import { BlockquoteIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const schema = {
	design: {
		type: 'string',
		default: 'plain',
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Container.
	...createBackgroundAttributes( 'container%s' ),

	// Quote.
	showQuote: {
		type: 'boolean',
		default: true,
	},
	quoteIcon: {
		type: 'string',
		default: 'round-thin',
	},
	quoteOpacity: {
		type: 'number',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
	},
	quoteSize: {
		type: 'number',
		default: 70,
	},
	...createAllCombinationAttributes(
		'quote%s%s', {
			type: 'number',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ],
		[ 'X', 'Y' ]
	),

	// Text.
	text: {
		source: 'html',
		selector: '.ugb-blockquote__text',
		default: descriptionPlaceholder( 'long' ),
	},
	...createTypographyAttributes( 'text%s' ),
	textColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'text%sAlign', {
		type: 'string',
		default: '',
	} ),
}

export const name = 'ugb/blockquote'

export const settings = {
	title: __( 'Blockquote', i18n ),
	description: __( 'Display a quote in style.', i18n ),
	icon: BlockquoteIcon,
	category: 'stackable',
	keywords: [
		__( 'Blockquote', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	attributes: schema,

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			columnGap: false,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.blockquote.custom-css.default', '' ),
		},
	},
}
