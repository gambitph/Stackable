/**
 * BLOCK: Blockquote
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { __ } from '@wordpress/i18n'
import { BlockquoteIcon } from '@stackable/icons'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'

const schema = {
	align: {
		type: 'string',
	},
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
	backgroundColor: {
		type: 'string',
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
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	quotationMark: {
		type: 'string',
		default: 'round-thin',
	},
	quotationSize: {
		type: 'number',
		default: 70,
	},
	design: {
		type: 'string',
		default: 'plain',
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

export const name = 'ugb/blockquote'

export const settings = {
	title: __( 'Blockquote' ),
	description: __( 'Display a quote in style.' ),
	icon: BlockquoteIcon,
	category: 'stackable',
	keywords: [
		__( 'Blockquote' ),
		__( 'Stackable' ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	attributes: schema,

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/blockquote-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
