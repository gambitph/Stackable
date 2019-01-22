/**
 * BLOCK: CTA Block.
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */
import { __ } from '@wordpress/i18n'
import { CTAIcon } from '@stackable/icons'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'

const schema = {
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
	},
	newTab: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'target',
		default: false,
	},
	ctaTitle: {
		source: 'html',
		selector: 'h3',
		default: __( 'Title for This Block' ),
	},
	bodyText: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder(),
	},
	buttonText: {
		source: 'html',
		selector: '.ugb-button span',
		default: __( 'Button text' ),
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	color: {
		type: 'string',
	},
	textColor: {
		type: 'string',
		default: '#ffffff',
	},
	titleColor: {
		type: 'string',
	},
	bodyTextColor: {
		type: 'string',
	},
	size: {
		type: 'string',
		default: 'normal',
	},
	borderButtonRadius: {
		type: 'number',
		default: 4,
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
	buttonIcon: {
		type: 'string',
	},
	contentWidth: {
		type: 'boolean',
		default: false,
	},
	design: {
		type: 'string',
		default: 'basic',
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	bgColor: {
		type: 'string',
	},
}

export const name = 'ugb/cta'

export const settings = {
	title: __( 'Call to Action' ),
	description: __( 'A small section you can use to call the attention of your visitors. Great for calling attention to your products or deals.' ),
	icon: CTAIcon,
	category: 'stackable',
	keywords: [
		__( 'Call to Action' ),
		__( 'Stackable' ),
		__( 'CTA' ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/call-to-action-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
