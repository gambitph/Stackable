/**
 * External dependencies
 */
import {
	createResponsiveAttributes,
	createBackgroundAttributes,
	createAllCombinationAttributes,
	createTypographyAttributes,
	createBorderAttributes,
} from '~stackable/util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	design: {
		type: 'string',
		default: 'basic',
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},
	onlyOnePanelOpen: {
		type: 'boolean',
		default: false,
	},
	openStart: {
		type: 'boolean',
		default: false,
	},
	reverseArrow: {
		type: 'boolean',
		default: false,
	},

	// Container.
	...createBackgroundAttributes( 'container%s' ),
	containerClosedBackgroundColor: {
		type: 'string',
		default: '',
	},

	// Border.
	...createBorderAttributes( 'container%s' ),

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-accordion__title',
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

	// Arrow.
	showArrow: {
		type: 'boolean',
		default: true,
	},
	arrowSize: {
		type: 'number',
		default: '',
	},
	arrowColor: {
		type: 'string',
		default: '',
	},

	// Border.
	showBorder: {
		type: 'boolean',
		default: true,
	},
	borderSize: {
		type: 'number',
		default: '',
	},
	borderColor: {
		type: 'string',
		default: '',
	},

	// Alignment.
	...createAllCombinationAttributes(
		'Title%sAlign', {
			type: 'string',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing
	...createAllCombinationAttributes(
		'containerPadding%s', {
			type: 'number',
			default: '',
		},
		[ 'Top', 'Right', 'Bottom', 'Left' ]
	),
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	displayCondition: {
		type: 'object',
	},
}
