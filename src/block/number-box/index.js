/**
 * BLOCK: Number Box Block.
 */

import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { camelCase } from 'lodash'
import { default as deprecated } from './deprecated'
import { descriptionPlaceholder } from '@stackable/util'
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

	...[ '', 'tablet', 'mobile' ].reduce( ( attributes, screen ) => {
		attributes[ camelCase( `${ screen }ColumnGap` ) ] = {
			type: 'number',
			default: 35,
		}
		return attributes
	}, {} ),

	// Container attributes.
	...[ '', 'Tablet', 'Mobile' ].reduce( ( attributes, screen ) => {
		return {
			...attributes,
			...[ 'Top', 'Right', 'Bottom', 'Left' ].reduce( ( attributes, direction ) => {
				attributes[ `box${ screen }${ direction }Padding` ] = {
					type: 'number',
					default: '',
				}
				return attributes
			}, {} ),
		}
	}, {} ),

	// boxTopPadding: {
	// 	type: 'number',
	// 	default: '',
	// },
	// boxRightPadding: {
	// 	type: 'number',
	// 	default: '',
	// },
	// boxBottomPadding: {
	// 	type: 'number',
	// 	default: '',
	// },
	// boxLeftPadding: {
	// 	type: 'number',
	// 	default: '',
	// },

	// Number attributes.
	showNumber: {
		type: 'boolean',
		default: true,
	},
	...[ '', 'Tablet', 'Mobile' ].reduce( ( attributes, screen ) => {
		attributes[ `number${ screen }BottomMargin` ] = {
			type: 'number',
			default: '',
		}
		return attributes
	}, {} ),

	// Title attributes.
	showTitle: {
		type: 'boolean',
		default: true,
	},
	...[ '', 'Tablet', 'Mobile' ].reduce( ( attributes, screen ) => {
		attributes[ `title${ screen }BottomMargin` ] = {
			type: 'number',
			default: '',
		}
		attributes[ `title${ screen }Size` ] = {
			type: 'number',
			default: '',
		}
		return attributes
	}, {} ),

	// Description attributes.
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...[ '', 'Tablet', 'Mobile' ].reduce( ( attributes, screen ) => {
		attributes[ `description${ screen }Size` ] = {
			type: 'number',
			default: '',
		}
		return attributes
	}, {} ),

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
		align: [ 'center', 'wide' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	deprecated,
	save,
	edit,

	// Stackable modules.
	modules: {
		'advanced-spacing': {},
		'custom-css': {
			default: applyFilters( 'stackable.number-box.custom-css.default', '' ),
		},
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/number-box-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
