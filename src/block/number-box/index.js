/**
 * BLOCK: Number Box Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
import { NumberBoxIcon } from '@stackable/icons'

export const schema = {
	num1: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(1) .ugb-number-box__number',
		default: '01',
	},
	num2: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(2) .ugb-number-box__number',
		default: '02',
	},
	num3: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(3) .ugb-number-box__number',
		default: '03',
	},
	title1: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(1) .ugb-number-box__title',
		default: __( 'Title', i18n ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(2) .ugb-number-box__title',
		default: __( 'Title', i18n ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(3) .ugb-number-box__title',
		default: __( 'Title', i18n ),
	},
	description1: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(1) .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	description2: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(2) .ugb-number-box__description',
		default: descriptionPlaceholder(),
	},
	description3: {
		source: 'html',
		selector: '.ugb-number-box__item:nth-of-type(3) .ugb-number-box__description',
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
		default: 3,
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
	title: __( 'Number Box', i18n ),
	description: __( 'Display steps or methods that your users will do in your service. For example, "Get started in just 3 easy steps: 1, 2 and 3!"', i18n ),
	icon: NumberBoxIcon,
	category: 'stackable',
	keywords: [
		__( 'Number Box', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/number-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
