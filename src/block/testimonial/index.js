/**
 * BLOCK: Testimonial Block.
 */

import { disabledBlocks, i18n } from 'stackable'
import { __ } from '@wordpress/i18n'
import { descriptionPlaceholder } from '@stackable/util'
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
		selector: '.ugb-testimonial__item:nth-of-type(1) .ugb-testimonial__name',
		default: __( 'Name', i18n ),
	},
	name2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(2) .ugb-testimonial__name',
		default: __( 'Name', i18n ),
	},
	name3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(3) .ugb-testimonial__name',
		default: __( 'Name', i18n ),
	},
	position1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(1) .ugb-testimonial__position',
		default: __( 'Position', i18n ),
	},
	position2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(2) .ugb-testimonial__position',
		default: __( 'Position', i18n ),
	},
	position3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(3) .ugb-testimonial__position',
		default: __( 'Position', i18n ),
	},
	testimonial1: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(1) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial2: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(2) .ugb-testimonial__body',
		default: descriptionPlaceholder( 'medium' ),
	},
	testimonial3: {
		source: 'html',
		selector: '.ugb-testimonial__item:nth-of-type(3) .ugb-testimonial__body',
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
	backgroundColor: {
		type: 'string',
		default: '',
	},
	serif: {
		type: 'boolean',
		default: false,
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
	align: {
		type: 'string',
	},
}

export const name = 'ugb/testimonial'

export const settings = {
	title: __( 'Testimonial', i18n ),
	description: __( 'Showcase what your users say about your product or service.', i18n ),
	icon: TestimonialIcon,
	category: 'stackable',
	keywords: [
		__( 'Testimonial', i18n ),
		__( 'Stackable', i18n ),
	],
	attributes: schema,
	supports: {
		align: [ 'wide' ],
		inserter: ! disabledBlocks.includes( name ), // Hide if disabled.
	},

	// Stackable specific settings.
	sDemoURL: 'https://wpstackable.com/testimonial-block/?utm_source=welcome&utm_medium=settings&utm_campaign=view_demo&utm_content=demolink',
}
