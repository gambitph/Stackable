/**
 * External dependencies
 */
import {
	createResponsiveAttributes,
	createAllCombinationAttributes,
	createBorderAttributes,
} from '~stackable/util'
import {
	createBackgroundAttributes,
} from '../../util'

export default {
	design: {
		type: 'string',
		default: 'plain',
	},

	...createResponsiveAttributes( '%sColumnContentVerticalAlign', {
		type: 'string',
		default: '',
	} ),
	...createResponsiveAttributes( 'content%sWidth', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'content%sWidthUnit', {
		type: 'string',
		default: '',
	} ),
	...createResponsiveAttributes( 'content%sHorizontalAlign', {
		type: 'string',
		default: '',
	} ),

	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	// Column Background
	...createBackgroundAttributes( 'column%s' ),

	// Border.
	...createBorderAttributes( 'column%s' ),

	// Text Colors
	...createAllCombinationAttributes(
		'%sColor', {
			type: 'string',
			default: '',
		},
		[ 'Heading', 'BodyText', 'Link', 'LinkHover' ]
	),
}
