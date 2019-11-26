/**
 * BLOCK: Number Box Block.
 */
/**
 * External dependencies
 */
import {
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
	descriptionPlaceholder,
} from '~stackable/util'
import { NumberBoxIcon } from '~stackable/icons'

/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { disabledBlocks, i18n } from 'stackable'

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
		default: __( 'Title', i18n ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-number-box__item2 .ugb-number-box__title',
		default: __( 'Title', i18n ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-number-box__item3 .ugb-number-box__title',
		default: __( 'Title', i18n ),
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
		default: '',
	},
	numberBGColor: {
		type: 'string',
		default: '',
	},
	titleColor: {
		type: 'string',
		default: '',
	},
	descriptionColor: {
		type: 'string',
		default: '',
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
		default: '',
	},
	shadow: {
		type: 'number',
		default: '',
	},

	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Number', 'Title', 'Description' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Column.
	...createBackgroundAttributes( 'column%s' ),

	// Number attributes.
	showNumber: {
		type: 'boolean',
		default: true,
	},
	numberStyle: {
		type: 'string',
		default: '',
	},
	numberOpacity: {
		type: 'number',
		default: '',
	},
	...createTypographyAttributes( 'number%s' ),
	...createResponsiveAttributes( 'number%sPadding', {
		type: 'number',
		default: '',
	} ),
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
	...createResponsiveAttributes( 'description%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createTypographyAttributes( 'description%s' ),

	// Individual column colors.
	...createAllCombinationAttributes(
		'Column%s%sColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3' ],
		[ 'Background', 'NumberBackground' ]
	),

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	backgroundColor: {
		type: 'string',
	},
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
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
	deprecated,
	save,
	edit,

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		'advanced-column-spacing': {
			verticalColumnAlign: true,
		},
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.number-box.custom-css.default', '' ),
		},
	},
}
