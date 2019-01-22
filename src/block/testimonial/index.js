/**
 * BLOCK: Testimonial Block.
 */

import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
import { disabledBlocks } from 'stackable'
import { TestimonialIcon } from '@stackable/icons'

export const schema = {
	mediaID1: {
		type: 'number',
	},
	mediaID2: {
		type: 'number',
	},
	mediaID3: {
		type: 'number',
	},
	mediaURL1: {
		type: 'string',
	},
	mediaURL2: {
		type: 'string',
	},
	mediaURL3: {
		type: 'string',
	},
	name1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(1) .ugb-testimonial__name',
		default: __( 'Name' ),
	},
	name2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(2) .ugb-testimonial__name',
		default: __( 'Name' ),
	},
	name3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(3) .ugb-testimonial__name',
		default: __( 'Name' ),
	},
	position1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(1) .ugb-testimonial__position',
		default: __( 'Position' ),
	},
	position2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(2) .ugb-testimonial__position',
		default: __( 'Position' ),
	},
	position3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(3) .ugb-testimonial__position',
		default: __( 'Position' ),
	},
	testimonial1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(1) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(2) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-child(3) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	titleColor: {
		type: 'string',
	},
	posColor: {
		type: 'string',
	},
	bodyTextColor: {
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

	// Keep the old attributes. Gutenberg issue https://github.com/WordPress/gutenberg/issues/10406
	href: {
		type: 'url',
	},
	hrefTwo: {
		type: 'url',
	},
	hrefThree: {
		type: 'url',
	},
	mediaID: {
		type: 'number',
	},
	mediaIDTwo: {
		type: 'number',
	},
	mediaIDThree: {
		type: 'number',
	},
	mediaURL: {
		type: 'string',
	},
	mediaURLTwo: {
		type: 'string',
	},
	mediaURLThree: {
		type: 'string',
	},
	testimonialTitle: {
		type: 'string',
	},
	testimonialTitleTwo: {
		type: 'string',
	},
	testimonialTitleThree: {
		type: 'string',
	},
	position: {
		type: 'string',
	},
	positionTwo: {
		type: 'string',
	},
	positionThree: {
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
	iconColor: {
		type: 'string',
	},
}

export const name = 'ugb/testimonial'

export const settings = {
	title: __( 'Testimonial' ),
	description: __( 'Showcase what your users say about your product or service.' ),
	icon: TestimonialIcon,
	category: 'stackable',
	keywords: [
		__( 'Testimonial' ),
		__( 'Stackable' ),
	],
	attributes: schema,
	supports: {
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/testimonial-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
