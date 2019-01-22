/**
 * BLOCK: Pullquote
 */

import { __ } from '@wordpress/i18n'
import { BlockquoteIcon } from '@stackable/icons'
import { descriptionPlaceholder } from '@stackable/util'

export const schema = {
	text: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'long' ),
	},
	color: {
		type: 'string',
		default: '',
	},
	quoteColor: {
		type: 'string',
		default: '',
	},
}

export const name = 'ugb/pullquote'

export const settings = {
	title: __( 'Pullquote' ),
	description: __( 'Display a quote. This is similar to the Blockquote block, but meant to display a quote from within your current post.' ),
	icon: BlockquoteIcon,
	category: 'stackable',
	keywords: [
		__( 'Pullquote' ),
		__( 'Stackable' ),
	],
	attributes: schema,

	// Hide! See readme.
	supports: {
		inserter: false,
	},

	// Stackable specific settings.
	sDeprecated: true,
	sDemoURL: 'https://wpstackable.com/pull-quote-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
