/**
 * BLOCK: Feature Grid Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
import { FeatureGridIcon } from '@stackable/icons'

export const schema = {
	design: {
		type: 'string',
		default: 'basic',
	},
	columns: {
		type: 'number',
		default: 3,
	},
	imageSize: {
		type: 'number',
		default: 100,
	},
	imageID1: {
		type: 'number',
	},
	imageID2: {
		type: 'number',
	},
	imageID3: {
		type: 'number',
	},
	imageUrl1: {
		type: 'url',
	},
	imageUrl2: {
		type: 'url',
	},
	imageUrl3: {
		type: 'url',
	},
	imageAlt1: {
		type: 'string',
	},
	imageAlt2: {
		type: 'string',
	},
	imageAlt3: {
		type: 'string',
	},
	title1: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-feature-grid__title',
		default: __( 'Title', i18n ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-feature-grid__title',
		default: __( 'Title', i18n ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-feature-grid__title',
		default: __( 'Title', i18n ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-feature-grid__description',
		default: descriptionPlaceholder( 'short' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-feature-grid__description',
		default: descriptionPlaceholder( 'short' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-feature-grid__description',
		default: descriptionPlaceholder( 'short' ),
	},
	linkUrl1: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-button',
		attribute: 'href',
		default: '',
	},
	linkUrl2: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-button',
		attribute: 'href',
		default: '',
	},
	linkUrl3: {
		type: 'string',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-button',
		attribute: 'href',
		default: '',
	},
	newTab1: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-button',
		attribute: 'target',
		default: false,
	},
	newTab2: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-button',
		attribute: 'target',
		default: false,
	},
	newTab3: {
		type: 'boolean',
		source: 'attribute',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-button',
		attribute: 'target',
		default: false,
	},
	linkText1: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(1) .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	linkText2: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(2) .ugb-button span',
		default: __( 'Button text', i18n ),
	},
	linkText3: {
		source: 'html',
		selector: '.ugb-feature-grid__item:nth-of-type(3) .ugb-button span',
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
		default: 'link',
	},
	buttonIcon: {
		type: 'string',
	},
	borderRadius: {
		type: 'number',
		default: 12,
	},
	shadow: {
		type: 'number',
		default: 3,
	},
	hoverEffect: {
		type: 'string',
		default: '',
	},
	align: {
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

export const name = 'ugb/feature-grid'

export const settings = {
	title: __( 'Feature Grid', i18n ),
	description: __( 'Display multiple product features or services. You can use Feature Grids one after another.', i18n ),
	icon: FeatureGridIcon,
	category: 'stackable',
	keywords: [
		__( 'Feature Grid', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'wide' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/feature-grid-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
