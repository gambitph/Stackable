/**
 * BLOCK: Notification
 */
import { __ } from '@wordpress/i18n'
import deprecated from './deprecated'
import { disabledBlocks } from 'stackable'
import edit from './edit'
import { ExpandIcon } from '@stackable/icons'
import save from './save'

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
		// eslint-disable-next-line
		inserter: false, // TODO: Remove when ready for v2.
	},

	deprecated,
	edit,
	save,

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/expand-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
