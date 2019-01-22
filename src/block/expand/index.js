/**
 * BLOCK: Notification
 */
import { __ } from '@wordpress/i18n'
import { disabledBlocks } from 'stackable'
import { ExpandIcon } from '@stackable/icons'

export const schema = {
	text: {
		source: 'html',
		selector: '.ugb-expand__less-text',
		multiline: 'p',
		default: '',
	},
	moreText: {
		source: 'html',
		selector: '.ugb-expand__more-text',
		multiline: 'p',
		default: '',
	},
	moreLabel: {
		source: 'html',
		selector: '.ugb-expand__more-toggle-text',
		default: __( 'Show more' ),
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand__less-toggle-text',
		default: __( 'Show less' ),
	},
}

export const name = 'ugb/expand'

export const settings = {
	title: __( 'Expand / Show More' ),
	description: __( 'Display a small snippet of text. Your readers can toggle it to show more information.' ),
	icon: ExpandIcon,
	category: 'stackable',
	keywords: [
		__( 'Expand' ),
		__( 'Show more/less' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/expand-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
