/**
 * BLOCK: Accordion Block.
 */
/**
 * Internal dependencies
 */
import './design'
import deprecated from './deprecated'
import edit from './edit'
import save from './save'

/**
 * External dependencies
 */
import { AccordionIcon } from '~stackable/icons'
import {
	createResponsiveAttributes,
	createBackgroundAttributes,
	createAllCombinationAttributes,
	createTypographyAttributes,
} from '~stackable/util'
import { disabledBlocks, i18n } from 'stackable'

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n'
import { applyFilters } from '@wordpress/hooks'

const schema = {
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
	onlyOnePanelOpen: {
		type: 'boolean',
		default: false,
	},
	openStart: {
		type: 'boolean',
		default: false,
	},
	reverseArrow: {
		type: 'boolean',
		default: false,
	},

	// Container.
	...createBackgroundAttributes( 'container%s' ),
	containerClosedBackgroundColor: {
		type: 'string',
		default: '',
	},

	// Title.
	title: {
		source: 'html',
		selector: '.ugb-accordion__title',
		default: __( 'Title for This Block', i18n ),
	},
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

	// Arrow.
	showArrow: {
		type: 'boolean',
		default: true,
	},
	arrowSize: {
		type: 'number',
		default: '',
	},
	arrowColor: {
		type: 'string',
		defualt: '',
	},

	// Border.
	showBorder: {
		type: 'boolean',
		default: true,
	},
	borderSize: {
		type: 'number',
		default: '',
	},
	borderColor: {
		type: 'string',
		defualt: '',
	},

	// Alignment.
	...createAllCombinationAttributes(
		'Title%sAlign', {
			type: 'string',
			default: '',
		},
		[ '', 'Tablet', 'Mobile' ]
	),

	// Spacing
	...createAllCombinationAttributes(
		'containerPadding%s', {
			type: 'number',
			default: '',
		},
		[ 'Top', 'Right', 'Bottom', 'Left' ]
	),
	...createResponsiveAttributes( 'title%sBottomMargin', {
		type: 'number',
		default: '',
	} ),
}

export const name = 'ugb/accordion'

export const settings = {
	title: __( 'Accordion', i18n ),
	description: __( 'A title that your visitors can toggle to view more text. Use as FAQs or multiple ones for an Accordion.', i18n ),
	icon: AccordionIcon,
	category: 'stackable',
	keywords: [
		__( 'Accordion', i18n ),
		__( 'Toggle', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,

	deprecated,
	edit,
	save,

	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable modules.
	modules: {
		'advanced-general': true,
		'advanced-block-spacing': true,
		// 'advanced-column-spacing': {
		// 	columnGap: false,
		// },
		'advanced-responsive': true,
		// 'block-background': true,
		// 'block-separators': true,
		// 'block-title': true,
		'content-align': true,
		'block-designs': true,
		'custom-css': {
			default: applyFilters( 'stackable.cta.custom-css.default', '' ),
		},
	},
}
