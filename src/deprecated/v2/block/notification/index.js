/**
 * BLOCK: Notification
 */

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'
import schema from './schema'
import example from './example'
import _metadata from './block.json'

/**
 * External dependencies
 */
import { NotificationIcon } from '~stackable/icons'
import { v2disabledBlocks as disabledBlocks } from 'stackable'

/**
 * WordPress dependencies
 */
import { applyFilters, addFilter } from '@wordpress/hooks'

const {
	name,
	...metadata
} = _metadata

export { name }

export const settings = {
	...metadata,
	title: metadata.title + ' (v2)',
	icon: NotificationIcon,
	attributes: schema,
	example,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		anchor: true,
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			columnGap: false,
			paddings: false,
		},
		'advanced-custom-attributes': true,
		'advanced-responsive': true,
		'block-background': {
			importantBackgroundSize: true,
		},
		// 'block-separators': true,
		// 'block-title': true,
		'container-link': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.notification.custom-css.default', '' ),
		},
	},
}

addFilter( 'stackable.notification.setAttributes', 'stackable/notification/notifType', attributes => {
	if ( typeof attributes.notifType === 'undefined' ) {
		return attributes
	}

	return {
		...attributes,
		columnBackgroundColor: '',
		columnBackgroundColorOpacity: '',
		iconColor: '',
		titleColor: '',
		descriptionColor: '',
		buttonBackgroundColor: '',
		columnBorderColor: '',
	}
} )

// When background opacity is set or when the background color is reset, revert background color to notification color.
addFilter( 'stackable.notification.setAttributes', 'stackable/notification/opacity', ( attributes, blockProps ) => {
	const setColumnBackgroundColor = attributes.hasOwnProperty( 'columnBackgroundColor' )
	if ( typeof attributes.columnBackgroundColorOpacity === 'undefined' && ! setColumnBackgroundColor ) {
		return attributes
	}

	// If a new background color is set, do not revert to notification color.
	if ( setColumnBackgroundColor && typeof attributes.columnBackgroundColor !== 'undefined' ) {
		return attributes
	}

	const {
		notifType = 'success',
		columnBackgroundColor = '',
	} = blockProps.attributes

	const NOTIFY_BACKGROUND_COLORS = {
		success: '#40ba7b',
		error: '#d9534f',
		info: '#2091e1',
		warning: '#ffdd57',
	}

	return {
		...attributes,
		columnBackgroundColor: columnBackgroundColor && ! setColumnBackgroundColor ? columnBackgroundColor : NOTIFY_BACKGROUND_COLORS[ notifType ],
	}
} )
