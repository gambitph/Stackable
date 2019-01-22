/**
 * BLOCK: Notification
 */

import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'
import { NotificationIcon } from '@stackable/icons'

export const schema = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	notifType: {
		type: 'string',
		default: 'success',
	},
	dismissible: {
		type: 'boolean',
		default: false,
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
}

export const name = 'ugb/notification'

export const settings = {
	title: __( 'Notification' ),
	description: __( 'Show a notice to your readers. People can dismiss the notice to permanently hide it.' ),
	icon: NotificationIcon,
	category: 'stackable',
	keywords: [
		__( 'Notification' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/notification-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
