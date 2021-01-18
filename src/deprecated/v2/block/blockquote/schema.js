/**
 * Internal dependencies
 */
import './design'

/**
 * External dependencies
 */
import {
	createBackgroundAttributes,
	descriptionPlaceholder,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createResponsiveAttributes,
	createBorderAttributes,
} from '~stackable/util'

export default {
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

	// Border.
	...createBorderAttributes( 'column%s' ),

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
