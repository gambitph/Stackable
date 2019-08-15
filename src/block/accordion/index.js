/**
 * BLOCK: Accordion Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { AccordionIcon } from '@stackable/icons'
import { descriptionPlaceholder } from '@stackable/util'
import SVGArrowIcon from './images/arrow.svg'

export const ArrowIcon = ( { fill } ) => <SVGArrowIcon width="20" height="20" fill={ fill } />

export const schema = {
	heading: {
		source: 'html',
		selector: '.ugb-accordion__heading h4',
		default: __( 'Title for This Block', i18n ),
	},
	text: {
		source: 'html',
		selector: '.ugb-accordion__text',
		default: descriptionPlaceholder( 'long' ),
	},
	headingColor: {
		type: 'string',
	},
	headingBackgroundColor: {
		type: 'string',
	},
	openStart: {
		type: 'boolean',
		default: false,
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

	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},
}
