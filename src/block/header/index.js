/**
 * BLOCK: Header Block.
 */

/**
 * External dependencies
 */
import {
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createButtonAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
	descriptionPlaceholder,
} from '~stackable/util'
import { HeaderIcon } from '~stackable/icons'
import { disabledBlocks, i18n } from 'stackable'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const schema = {
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
		defualt: '',
	},
	titleColor: {
		type: 'string',
		defualt: '',
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
		defualt: '',
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

export const name = 'ugb/header'

export const settings = {
	title: __( 'Header', i18n ),
	description: __( 'A large header title area. Typically used at the very top of a page.', i18n ),
	icon: HeaderIcon,
	category: 'stackable',
	keywords: [
		__( 'Header', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
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
		'advanced-column-spacing': { columnGap: false },
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.header.custom-css.default', '' ),
		},
	},
}
