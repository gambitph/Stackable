/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		showImage = true,
		showName = true,
		showPosition = true,
		showDescription = true,
		showSocial = true,
	} = blockProps.attributes

	return applyFilters( 'stackable.team-member.show', {
		columnBackground: design !== 'plain' && design !== 'overlay' && design !== 'overlay-simple',
		borderRadius: design !== 'plain',
		shadow: design !== 'plain',
		social: design !== 'overlay',
		imageAsBackground: design === 'overlay' || design === 'half' || design === 'overlay-simple',
		imageBackgroundHeight: design === 'overlay' || design === 'overlay-simple',
		imageBackgroundWidth: design === 'half',
		imageSpacing: showImage && ( design === 'basic' || design === 'plain' ),
		nameSpacing: showName,
		positionSpacing: showPosition,
		descriptionSpacing: showDescription,
		socialSpacing: showSocial && design !== 'overlay',
	}, blockProps )
}
