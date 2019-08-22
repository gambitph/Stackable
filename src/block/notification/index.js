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
import { descriptionPlaceholder } from '~stackable/util'
import edit from './edit'
import { NotificationIcon } from '~stackable/icons'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks, i18n } from 'stackable'

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

	// Custom CSS attributes.
	customCSSUniqueID: {
		type: 'string',
		default: '',
	},
	customCSS: {
		type: 'string',
		default: '',
	},
	customCSSCompiled: {
		type: 'string',
		default: '',
	},
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
		// eslint-disable-next-line
		inserter: false, // TODO: Remove when ready for v2.
	},

	deprecated,
	edit,
	save,
}
