/**
 * BLOCK: Accordion Block.
 */

import { __ } from '@wordpress/i18n'
import { AccordionIcon } from '@stackable/icons'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'

export const ArrowIcon = props => {
	return (
		<svg role="img" focusable="false" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" { ...props }>
			<polygon points="16.7,3.3 10,10 3.3,3.4 0,6.7 10,16.7 10,16.6 20,6.7 " />
		</svg>
	)
}

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

	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/accordion-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
