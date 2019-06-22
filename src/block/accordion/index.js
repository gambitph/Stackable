/**
 * BLOCK: Accordion Block.
 */

import { __ } from '@wordpress/i18n'
import { AccordionIcon } from '@stackable/icons'
import deprecated from './deprecated'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'
import edit from './edit'
import save from './save'
import SVGArrowIcon from './images/arrow.svg'

export const ArrowIcon = ( { fill } ) => <SVGArrowIcon width="20" height="20" fill={ fill } />

export const schema = {
	heading: {
		source: 'html',
		selector: '.ugb-accordion__heading h4',
		default: __( 'Title for This Block' ),
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
	title: __( 'Accordion' ),
	description: __( 'A title that your visitors can toggle to view more text. Use as FAQs or multiple ones for an Accordion.' ),
	icon: AccordionIcon,
	category: 'stackable',
	keywords: [
		__( 'Accordion' ),
		__( 'Toggle' ),
		__( 'Stackable' ),
	],
	attributes: schema,

	deprecated,
	edit,
	save,

	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
		// eslint-disable-next-line
		inserter: false, // TODO: Remove when ready for v2.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/accordion-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
