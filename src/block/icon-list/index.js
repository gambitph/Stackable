/**
 * BLOCK: Icon List Block.
 */

import { __ } from '@wordpress/i18n'
import { disabledBlocks } from 'stackable'
import { IconListIcon } from '@stackable/icons'

export const schema = {
	icon: {
		type: 'string',
		default: 'check',
	},
	iconShape: {
		type: 'string',
	},
	iconColor: {
		type: 'string',
	},
	iconSize: {
		type: 'number',
		default: 20,
	},
	columns: {
		type: 'number',
		default: 1,
	},
	text: {
		source: 'html',
		selector: 'ul',
		multiline: 'li',
	},
	gap: {
		type: 'number',
		default: 16,
	},
}

export const name = 'ugb/icon-list'

export const settings = {
	title: __( 'Icon List' ),
	description: __( 'An unordered list with icons. You can use this as a list of features or benefits.' ),
	icon: IconListIcon,
	category: 'stackable',
	keywords: [
		__( 'Icon List' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/icon-list-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
