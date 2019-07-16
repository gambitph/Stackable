/**
 * BLOCK: Feature Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
import { FeatureIcon } from '@stackable/icons'

export const schema = {
	textColor: {
		type: 'string',
	},
	invert: {
		type: 'boolean',
		default: false,
	},
	contentAlign: {
		type: 'string',
		default: 'left',
	},
	imageSize: {
		type: 'number',
		default: 400,
	},
	imageID: {
		type: 'number',
	},
	imageUrl: {
		type: 'url',
	},
	imageAlt: {
		type: 'string',
	},
	title: {
		source: 'html',
		selector: 'h2',
		default: __( 'Title for This Block', i18n ),
	},
	description: {
		source: 'html',
		selector: 'p',
		default: descriptionPlaceholder( 'medium' ),
	},
	buttonURL: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-button',
		attribute: 'href',
		default: '',
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
		default: __( 'Button text', i18n ),
	},
	buttonColor: {
		type: 'string',
	},
	buttonTextColor: {
		type: 'string',
	},
	buttonSize: {
		type: 'string',
		default: 'normal',
	},
	buttonBorderRadius: {
		type: 'number',
		default: 4,
	},
	buttonDesign: {
		type: 'string',
		default: 'basic',
	},
	buttonIcon: {
		type: 'string',
	},
	backgroundColorType: {
		type: 'string',
		default: '',
	},
	backgroundColor: {
		type: 'string',
	},
	backgroundColor2: {
		type: 'string',
		default: '',
	},
	backgroundColorDirection: {
		type: 'number',
		default: 0,
	},
	backgroundType: {
		type: 'string',
		default: '',
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
	align: {
		type: 'string',
	},
	hoverEffect: {
		type: 'string',
		default: '',
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

export const name = 'ugb/feature'

export const settings = {
	title: __( 'Feature', i18n ),
	description: __( 'Display a product feature or a service in a large area.', i18n ),
	icon: FeatureIcon,
	category: 'stackable',
	keywords: [
		__( 'Feature', i18n ),
		__( 'Stackable', i18n ),
	],
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	attributes: schema,

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/feature-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
