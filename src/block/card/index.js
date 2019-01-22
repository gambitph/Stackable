/**
 * BLOCK: Card Block.
 */

import { __ } from '@wordpress/i18n'
import { CardIcon } from '@stackable/icons'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'

export const schema = {
	mediaID: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-card__image-container',
		attribute: 'data-src',
	},
	heading: {
		source: 'html',
		selector: '.ugb-card__title',
		default: __( 'Title for This Block' ),
	},
	tagline: {
		source: 'html',
		selector: '.ugb-card__tagline',
		default: __( 'Subtitle for this block' ),
	},
	des: {
		source: 'html',
		selector: '.ugb-card__description',
		default: descriptionPlaceholder( 'long' ),
	},
	headingColor: {
		type: 'string',
	},
	taglineColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
	},
	buttonNewTab: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'target',
		default: false,
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: __( 'Button text' ),
	},
	buttonColor: {
		type: 'string',
	},
	buttonIcon: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
		default: '#ffffff',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	contentAlign: {
		type: 'string',
		default: 'left',
	},
	// Design related attributes.
	design: {
		type: 'string',
		default: 'basic',
	},
	backgroundColor: {
		type: 'string',
		default: '#ffffff',
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

export const name = 'ugb/card'

export const settings = {
	title: __( 'Card' ),
	description: __( 'Describe a single subject in a small card. You can use this to describe your product, service or a person.' ),
	icon: CardIcon,
	category: 'stackable',
	keywords: [
		__( 'Card' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/card-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
