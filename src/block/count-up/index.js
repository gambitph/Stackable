/**
 * BLOCK: Count Up
 */

import { __ } from '@wordpress/i18n'
import { CountUpIcon } from '@stackable/icons'
import { disabledBlocks } from 'stackable'

export const schema = {
	columns: {
		type: 'number',
		default: 4,
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
	title1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(1) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(2) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(3) .ugb-countup__title',
		default: __( 'Title' ),
	},
	title4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(4) .ugb-countup__title',
		default: __( 'Title' ),
	},
	countText1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(1) .ugb-countup__counter',
		default: '$99.99',
	},
	countText2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(2) .ugb-countup__counter',
		default: '1,234',
	},
	countText3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(3) .ugb-countup__counter',
		default: '1,234.56',
	},
	countText4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(4) .ugb-countup__counter',
		default: '£99.99',
	},
	description1: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(1) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description2: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(2) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description3: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(3) .ugb-countup__description',
		default: __( 'Description' ),
	},
	description4: {
		source: 'html',
		selector: '.ugb-countup__item:nth-child(4) .ugb-countup__description',
		default: __( 'Description' ),
	},
	textColor: {
		type: 'string',
	},
	countColor: {
		type: 'string',
	},
	countSize: {
		type: 'number',
		default: 40,
	},
	countFont: {
		type: 'string',
		default: 'theme',
	},
	countFontWeight: {
		type: 'string',
		default: '400',
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
	title: {
		type: 'string',
	},
	counter: {
		type: 'string',
	},
	des: {
		type: 'string',
	},
	fontSize: {
		type: 'number',
	},
	headingColor: {
		type: 'string',
	},
	desColor: {
		type: 'string',
	},
	color: {
		type: 'string',
	},
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

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/count-up-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
