/**
 * BLOCK: Button Block.
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { ButtonIcon } from '@stackable/icons'

export const schema = {
	buttons: {
		type: 'number',
		default: 1,
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: 'a',
		attribute: 'href',
		default: '',
	},
	newTab: {
		type: 'boolean',
		source: 'attribute',
		selector: 'a',
		attribute: 'target',
		default: false,
	},
	text: {
		source: 'html',
		selector: 'a span',
		default: __( 'Button text', i18n ),
	},
	align: {
		type: 'string',
		default: 'center',
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	cornerButtonRadius: {
		type: 'number',
		default: 4,
	},
	design: {
		type: 'string',
		default: 'basic',
	},
	icon: {
		type: 'string',
	},

	url2: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(2) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab2: {
		type: 'boolean',
		source: 'attribute',
		selector: 'div:nth-of-type(2) .ugb-button',
		attribute: 'target',
		default: false,
	},
	text2: {
		source: 'html',
		selector: 'div:nth-of-type(2) .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	color2: {
		type: 'string',
	},
	textColor2: {
		type: 'string',
		default: '#ffffff',
	},
	size2: {
		type: 'string',
		default: 'normal',
	},
	design2: {
		type: 'string',
		default: 'basic',
	},
	icon2: {
		type: 'string',
	},

	url3: {
		type: 'string',
		source: 'attribute',
		selector: 'div:nth-of-type(3) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab3: {
		type: 'boolean',
		source: 'attribute',
		selector: 'div:nth-of-type(3) .ugb-button',
		attribute: 'target',
		default: false,
	},
	text3: {
		source: 'html',
		selector: 'div:nth-of-type(3) .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	color3: {
		type: 'string',
	},
	textColor3: {
		type: 'string',
		default: '#ffffff',
	},
	size3: {
		type: 'string',
		default: 'normal',
	},
	design3: {
		type: 'string',
		default: 'basic',
	},
	icon3: {
		type: 'string',
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

export const name = 'ugb/button'

export const settings = {
	title: __( 'Button', i18n ),
	icon: ButtonIcon,
	description: __( 'Add a customizable button.', i18n ),
	category: 'stackable',
	keywords: [
		__( 'Button', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/button-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
