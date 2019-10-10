/**
 * BLOCK: Notification
 */

/**
 * Internal dependencies
 */
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * External dependencies
 */
import { ExpandIcon } from '~stackable/icons'
import {
	createAllCombinationAttributes,
	createTypographyAttributes,
	descriptionPlaceholder,
} from '~stackable/util'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

export const schema = {
	// Title.
	title: {
		source: 'html',
		selector: '.ugb-expand__title',
		default: __( 'Title for This Block', i18n ),
	},
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleTag: {
		type: 'string',
		defualt: '',
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},

	// Text.
	text: {
		source: 'html',
		selector: '.ugb-expand__less-text',
		multiline: 'p',
		default: `<p>${ __( 'Some short text that can be expanded to show more details.', i18n ) }</p>`,
	},
	moreText: {
		source: 'html',
		selector: '.ugb-expand__more-text',
		multiline: 'p',
		default: `<p>${ __( 'Some short text that can be expanded to show more details.', i18n ) } ${ descriptionPlaceholder( 'medium' ) }</p>`,
	},
	...createTypographyAttributes( 'text%s' ),
	textColor: {
		type: 'string',
		default: '',
	},

	// Link.
	moreLabel: {
		source: 'html',
		selector: '.ugb-expand__more-toggle-text',
		default: __( 'Show more', i18n ),
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand__less-toggle-text',
		default: __( 'Show less', i18n ),
	},
	...createTypographyAttributes( 'link%s' ),
	linkColor: {
		type: 'string',
		default: '',
	},

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Text', 'Link' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing.
	...createAllCombinationAttributes(
		'%s%sBottomMargin', {
			type: 'number',
			default: '',
		},
		[ 'Title', 'Text', 'Link' ],
		[ '', 'Tablet', 'Mobile' ]
	),
}

export const name = 'ugb/expand'

export const settings = {
	title: __( 'Expand / Show More', i18n ),
	description: __( 'Display a small snippet of text. Your readers can toggle it to show more information.', i18n ),
	icon: ExpandIcon,
	category: 'stackable',
	keywords: [
		__( 'Expand', i18n ),
		__( 'Show more/less', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		// 'advanced-column-spacing': {
		// 	columnGap: false,
		// 	height: false,
		// 	verticalContentAlign: false,
		// 	paddingSelector: '.ugb-block-content',
		// },
		'advanced-responsive': true,
		// 'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.expand.custom-css.default', '' ),
		},
	},
}
