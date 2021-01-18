/**
 * External dependencies
 */
import {
	createAllCombinationAttributes,
	createTypographyAttributes,
	descriptionPlaceholder,
} from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
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
		default: '',
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
