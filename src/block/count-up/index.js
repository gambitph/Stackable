/**
 * BLOCK: Count Up
 */

import {
	createAllCombinationAttributes,
	createBackgroundAttributes,
	createResponsiveAttributes,
	createTypographyAttributes,
} from '@stackable/util'
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'
import { CountUpIcon } from '@stackable/icons'
import deprecated from './deprecated'
import { disabledBlocks } from 'stackable'
import edit from './edit'
import save from './save'

export const schema = {
	title1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(1) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__title',
		default: __( 'Title' ),
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
		default: __( 'Description' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(2) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(3) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-of-type(4) .ugb-countup__description',
		default: __( 'Description' ),
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
}

export const name = 'ugb/count-up'

export const settings = {
	title: __( 'Count Up' ),
	description: __( 'Showcase your stats. Display how many customers you have or the number of downloads of your app.' ),
	icon: CountUpIcon,
	category: 'stackable',
	keywords: [
		__( 'Statistics' ),
		__( 'Count Up' ),
		__( 'Stackable' ),
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

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/count-up-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
