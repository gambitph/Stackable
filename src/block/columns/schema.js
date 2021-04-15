
/**
 * WordPress dependencies
 */
import { createResponsiveAttributes, createAllCombinationAttributes } from '~stackable/util'

export default {
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

	displayCondition: {
		type: 'object',
	},
}
