/**
 * BLOCK: Notification
 */
import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
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
		default: __( 'Show more', i18n ),
	},
	lessLabel: {
		source: 'html',
		selector: '.ugb-expand__less-toggle-text',
		default: __( 'Show less', i18n ),
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

export const name = 'ugb/expand'

export const settings = {
	title: __( 'Expand / Show More', i18n ),
	description: __( 'Display a small snippet of text. Your readers can toggle it to show more information.', i18n ),
	icon: ExpandIcon,
	category: 'stackable',
	keywords: [
		__( 'Expand', i18n ),
		__( 'Show more/less', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/expand-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
