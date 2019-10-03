/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showTitle = true,
		showDescription = true,
		showButton = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.feature.show', {
		imageColumnWidth: [ 'basic', 'plain', 'half' ].includes( design ),
		containerWidth: design.match( /^overlap/ ),
		containerOffset: design.match( /^overlap(.*)?[2-5]$/ ),
		reverseHorizontally: ! design.match( /^overlap-?\w*[45]$/ ),
		borderRadius: design !== 'plain',
		columnBackground: design !== 'plain',
		featuredImageAsBackground: design.match( /^(overlap-bg|half)/ ),
		titleSpacing: showTitle,
		descriptionSpacing: showDescription,
		buttonSpacing: showButton,
	}, blockProps )
}
