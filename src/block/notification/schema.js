
/**
 * External dependencies
 */
import {
	descriptionPlaceholder,
	createBackgroundAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
	createButtonAttributes,
	createAllCombinationAttributes,
	createIconAttributes,
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
	notifType: {
		type: 'string',
		default: 'success',
	},
	borderRadius: {
		type: 'number',
		default: '',
	},
	shadow: {
		type: 'number',
		default: 3,
	},

	// Border.
	columnBorderColor: {
		type: 'string',
		default: '',
	},
	columnBorderThickness: {
		type: 'number',
		default: '',
	},

	// Background.
	...createBackgroundAttributes( 'column%s' ),

	// Border.
	...createBorderAttributes( 'container%s' ),

	// Dismissible.
	dismissible: {
		type: 'boolean',
		default: false,
	},
	...createResponsiveAttributes( 'dismissibleIcon%sSize', {
		type: 'number',
		default: '',
	} ),
	dismissibleIconColor: {
		type: 'string',
		default: '',
	},

	// Icon.
	showIcon: {
		type: 'boolean',
		default: false,
	},
	icon: {
		type: 'string',
		source: 'html',
		selector: '.ugb-notification__icon .ugb-icon-inner-svg,' +
			// This one is for backward compatibility <= 2.6.
			'.ugb-notification__item:not(.ugb-notification--new-icon)',
		default: 'fas-exclamation-triangle',
	},
	...createIconAttributes( 'icon%s' ),
	...createResponsiveAttributes( 'icon%sAlign', {
		type: 'string',
		default: '',
	} ),
	...createAllCombinationAttributes(
		'icon%s',
		{
			type: 'number',
			default: '',
		},
		[ 'Top', 'Left' ]
	),

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-notification__title',
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
	...createResponsiveAttributes( 'title%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Description.
	description: {
		source: 'html',
		selector: '.ugb-notification__description',
		default: descriptionPlaceholder( 'long' ),
	},
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'description%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Button.
	showButton: {
		type: 'boolean',
		default: true,
	},
	...createButtonAttributes( 'button%s', { selector: '.ugb-button' } ),
	buttonDesign: {
		type: 'string',
		default: 'ghost',
	},
	...createResponsiveAttributes( 'button%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Spacing.
	...createResponsiveAttributes( 'icon%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'description%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'button%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	displayCondition: {
		type: 'object',
	},
}
