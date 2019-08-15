/**
 * BLOCK: Count Up
 */

import {
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
} from '@stackable/util'
import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { CountUpIcon } from '@stackable/icons'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

export const schema = {
	title1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(1) .ugb-countup__title',
		default: __( 'Title', i18n ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__title',
		default: __( 'Title', i18n ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__title',
		default: __( 'Title', i18n ),
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__title',
		default: __( 'Title', i18n ),
	},
	countText1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(1) .ugb-countup__counter',
		default: '$99.99',
	},
	countText2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__counter',
		default: '1,234',
	},
	countText3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__counter',
		default: '1,234.56',
	},
	countText4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__counter',
		default: '£99.99',
	},
	description1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(1) .ugb-countup__description',
		default: __( 'Description', i18n ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__description',
		default: __( 'Description', i18n ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__description',
		default: __( 'Description', i18n ),
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__description',
		default: __( 'Description', i18n ),
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
	columns: {
		type: 'number',
		default: 2,
	},

	// Column.
	...createBackgroundAttributes( 'column%s' ),

	// Spacing.
	...createResponsiveAttributes( 'icon%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
	...createResponsiveAttributes( 'number%sBottomMargin', {
		type: 'number',
		default: '',
	} ),

	// Icon.
	showIcon: {
		type: 'boolean',
		default: false,
	},
	iconColor: {
		type: 'string',
		default: '',
	},
	...createResponsiveAttributes( 'icon%sSize', {
		type: 'number',
		default: '',
	} ),
	icon1: {
		type: 'string',
		default: 'fas-cogs',
	},
	icon2: {
		type: 'string',
		default: 'fas-hands-helping',
	},
	icon3: {
		type: 'string',
		default: 'fas-envelope',
	},
	icon4: {
		type: 'string',
		default: 'fas-globe-americas',
	},

	// Number.
	showNumber: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'number%s' ),
	numberColor: {
		type: 'string',
		default: '',
	},

	// Title.
	showTitle: {
		type: 'boolean',
		default: true,
	},
	titleTag: {
		type: 'string',
		defualt: '',
	},
	...createTypographyAttributes( 'title%s' ),
	titleColor: {
		type: 'string',
		default: '',
	},

	// Description.
	showDescription: {
		type: 'boolean',
		default: true,
	},
	...createTypographyAttributes( 'description%s' ),
	descriptionColor: {
		type: 'string',
		default: '',
	},

	...createAllCombinationAttributes(
		'%s%sAlign', {
			type: 'string',
			default: '',
		},
		[ 'Icon', 'Number', 'Title', 'Description' ],
		[ '', 'Tablet', 'Mobile' ]
	),

	// Individual column colors.
	...createAllCombinationAttributes(
		'Column%s%sColor', {
			type: 'string',
			default: '',
		},
		[ '1', '2', '3', '4' ],
		[ 'Background', 'Icon', 'Number', 'Title', 'Description' ]
	),
}

export const name = 'ugb/count-up'

export const settings = {
	title: __( 'Count Up', i18n ),
	description: __( 'Showcase your stats. Display how many customers you have or the number of downloads of your app.', i18n ),
	icon: CountUpIcon,
	category: 'stackable',
	keywords: [
		__( 'Statistics', i18n ),
		__( 'Count Up', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,

	supports: {
		align: [ 'center', 'wide', 'full' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	deprecated,
	edit,
	save,

	// Stackable modules.
	modules: {
		'advanced-block-spacing': true,
		'advanced-column-spacing': true,
		'advanced-responsive': true,
		'block-background': true,
		'block-separators': true,
		'block-title': true,
		'content-align': true,
		'custom-css': {
			default: applyFilters( 'stackable.count-up.custom-css.default', '' ),
		},
	},
}

export const showOptions = blockProps => {
	return applyFilters( 'stackable.count-up.show', {
		columnBackground: false,
	}, blockProps )
}
