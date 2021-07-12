
/**
 * External dependencies
 */
import {
	createAllCombinationAttributes,
	createButtonAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
	createBorderAttributes,
	descriptionPlaceholder,
} from '~stackable/util'
import {
	createBackgroundAttributes,
} from '../../util'
import { i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'

export default {
	restrictContentWidth: {
		type: 'boolean',
		default: false,
	},
	fullHeight: {
		type: 'boolean',
		default: false,
	},
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

	// Alignments.
	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Title', 'Subtitle' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Column.
	...createBackgroundAttributes( 'column%s' ),
	columnBackgroundColor: {
		type: 'string',
		default: '#000000',
	},

	// Border.
	...createBorderAttributes( 'column%s' ),

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-header__title',
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
	titleColor: {
		type: 'string',
		default: '',
	},
	...createTypographyAttributes( 'title%s' ),

	// Subtitle
	subtitle: {
		source: 'html',
		selector: '.ugb-header__subtitle',
		default: descriptionPlaceholder(),
	},
	showSubtitle: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'subtitle%s' ),
	subtitleColor: {
		type: 'string',
		default: '',
	},

	// Button 1.
	showButton: {
		type: 'boolean',
		default: true,
	},
	...createButtonAttributes( 'button%s', { selector: '.ugb-button1' } ),
	...createResponsiveAttributes( 'button%sAlign', {
		type: 'string',
		default: '',
	} ),

	// Button 2.
	showButton2: {
		type: 'boolean',
		default: false,
	},
	...createButtonAttributes( 'button2%s', { selector: '.ugb-button2' } ),

	// Overlay.
	overlayColor: {
		type: 'string',
		default: '',
	},
	overlayOpacity: {
		type: 'number',
		default: '',
	},

	// Spacing.
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'subtitle%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'button%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'buttonGap%s', {
		type: 'number',
		default: '',
	} ),

	invert: {
		type: 'boolean',
		default: false,
	},
}
