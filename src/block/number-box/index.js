/**
 * BLOCK: Number Box Block.
 */

import { createResponsiveAttributes, createTypographyAttributes, descriptionPlaceholder } from '@stackable/util'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { default as deprecated } from './deprecated'
import { disabledBlocks } from 'stackable'
import { default as edit } from './edit'
import { NumberBoxIcon } from '@stackable/icons'
import { default as save } from './save'

export const schema = {
	num1: {
		source: 'html',
		selector: '.ugb-number-box__item1 .ugb-number-box__number',
		default: '01',
	},
	num2: {
		source: 'html',
		selector: '.ugb-number-box__item2 .ugb-number-box__number',
		default: '02',
	},
	num3: {
		source: 'html',
		selector: '.ugb-number-box__item3 .ugb-number-box__number',
		default: '03',
	},
	title1: {
		source: 'html',
		selector: '.ugb-number-box__item1 .ugb-number-box__title',
		default: __( 'Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-number-box__item2 .ugb-number-box__title',
		default: __( 'Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-number-box__item3 .ugb-number-box__title',
		default: __( 'Title' ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-number-box__item1 .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	description2: {
		source: 'html',
		selector: '.ugb-number-box__item2 .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	description3: {
		source: 'html',
		selector: '.ugb-number-box__item3 .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	numberColor: {
		type: 'string',
	},
	numberBGColor: {
		type: 'string',
	},
	titleColor: {
		type: 'string',
	},
	descriptionColor: {
		type: 'string',
	},
	columns: {
		type: 'number',
		default: 2,
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
	backgroundColor: {
		type: 'string',
	},

	...createResponsiveAttributes( '%sContentAlign', {
		type: 'string',
		default: '',
	} ),

	// Number attributes.
	showNumber: {
		type: 'boolean',
		default: true,
	},
	...createResponsiveAttributes( 'number%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	// Title attributes.
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleTag: {
		type: 'string',
		defualt: '',
	},
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createTypographyAttributes( 'title%s' ),

	// Description attributes.
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createResponsiveAttributes( 'description%sSize', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'description%sUnit', {
		type: 'string',
		default: 'px',
	} ),

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	numberBox: {
		type: 'string',
	},
	numberBoxTwo: {
		type: 'string',
	},
	numberBoxThree: {
		type: 'string',
	},
	name: {
		type: 'string',
	},
	nameTwo: {
		type: 'string',
	},
	nameThree: {
		type: 'string',
	},
	body: {
		type: 'string',
	},
	bodyTwo: {
		type: 'string',
	},
	bodyThree: {
		type: 'string',
	},
	numberBoxColor: {
		type: 'string',
	},
	nameColor: {
		type: 'string',
	},
	bodyTextColor: {
		type: 'string',
	},
}

export const name = 'ugb/number-box'

export const settings = {
	title: __( 'Number Box' ),
	description: __( 'Display steps or methods that your users will do in your service. For example, "Get started in just 3 easy steps: 1, 2 and 3!"' ),
	icon: NumberBoxIcon,
	category: 'stackable',
	keywords: [
		__( 'Number Box' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	deprecated,
	save,
	edit,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'custom-css': {
			default: applyFilters( 'stackable.number-box.custom-css.default', '' ),
		},
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/number-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
