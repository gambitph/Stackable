/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showTestimonial = true,
		showImage = true,
		showName = true,
		showPosition = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.testimonial.show', {
		columnBackground: design !== 'plain',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		imageAsBackground: false,
		testimonialSpacing: showTestimonial,
		imageSpacing: showImage && ! [ 'background', 'vertical', 'vertical-inverse' ].includes( design ),
		nameSpacing: showName,
		positionSpacing: showPosition,
	}, blockProps )
}
