/**
 * BLOCK: Notification
 */

/**
 * Internal dependencies
 */
import deprecated from './deprecated'

/**
 * External dependencies
 */
import {
	descriptionPlaceholder, createBackgroundAttributes, createResponsiveAttributes, createTypographyAttributes, createButtonAttributes, createAllCombinationAttributes,
} from '~stackable/util'
import edit from './edit'
import { NotificationIcon } from '~stackable/icons'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'
import { applyFilters, addFilter } from '@wordpress/hooks'

export const schema = {
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
		type: 'number',
		default: '',
	},
	columnBorderThickness: {
		type: 'number',
		default: '',
	},

	// Background.
	...createBackgroundAttributes( 'column%s' ),

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
		default: 'fas-exclamation-triangle',
	},
	iconColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'icon%sSize', {
		type: 'number',
		default: '',
	} ),
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
		[ 'Opacity', 'Rotation', 'Top', 'Left' ]
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
		defualt: '',
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
}

export const name = 'ugb/notification'

export const settings = {
	title: __( 'Notification', i18n ),
	description: __( 'Show a notice to your readers. People can dismiss the notice to permanently hide it.', i18n ),
	icon: NotificationIcon,
	category: 'stackable',
	keywords: [
		__( 'Notification', i18n ),
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
		'advanced-block-spacing': true,
		'advanced-column-spacing': { columnGap: false },
		'advanced-responsive': true,
		'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.notification.custom-css.default', '' ),
		},
	},
}

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showIcon = false,
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.notification.show', {
		columnBorder: false,
		columnBackground: design !== 'plain',
		backgroundColor: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		iconSpacing: showIcon && ( showTitle || showDescription || showButton ),
		titleSpacing: showTitle && ( showDescription || showButton ),
		descriptionSpacing: showDescription && showButton,
		iconAlign: true,
		iconLocation: false,
	}, blockProps )
}

addFilter( 'stackable.notification.setAttributes', 'stackable/notification/notifType', attributes => {
	if ( typeof attributes.notifType === 'undefined' ) {
		return attributes
	}

	return {
		...attributes,
		columnBackgroundColor: '',
		iconColor: '',
		titleColor: '',
		descriptionColor: '',
		buttonBackgroundColor: '',
		columnBorderColor: '',
	}
} )
