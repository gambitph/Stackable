/**
 * BLOCK: Container Block.
 */

import { __ } from '@wordpress/i18n'
import { ContainerIcon } from '@stackable/icons'
import { disabledBlocks } from 'stackable'

export const schema = {
	textColor: {
		type: 'string',
	},
	contentAlign: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
		default: '#f1f1f1',
	},
	backgroundImageID: {
		type: 'number',
	},
	backgroundImageURL: {
		type: 'string',
	},
	backgroundOpacity: {
		type: 'number',
		default: 5,
	},
	fixedBackground: {
		type: 'boolean',
		default: false,
	},
	height: {
		type: 'string',
		default: 'normal',
	},
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	contentLocation: {
		type: 'string',
		default: 'full',
	},
	verticalAlign: {
		type: 'string',
		default: 'center',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
	align: {
		type: 'string',
	},
}

export const name = 'ugb/container'

export const settings = {
	title: __( 'Container' ),
	description: __( 'A styled container that you can add other blocks inside. Use this to create unique layouts.' ),
	icon: ContainerIcon,
	category: 'stackable',
	keywords: [
		__( 'Container Layout' ),
		__( 'Row' ),
		__( 'Stackable' ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	attributes: schema,

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/container-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
