/**
 * BLOCK: Pullquote
 */

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
	title: 'Pullquote',
	description: 'Display a quote. This is similar to the Blockquote block, but meant to display a quote from within your current post.',
	icon: BlockquoteIcon,
	category: 'stackable',
	keywords: [
		'Pullquote',
		'Stackable',
	],
	attributes: schema,

	// Hide! See readme.
	supports: {
		inserter: false,
	},
}
