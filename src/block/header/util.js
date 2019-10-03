/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const showOptions = blockProps => {
	const {
		design = 'basic',
		align = '',
		showTitle = true,
		showSubtitle = true,
		showButton = true,
		showButton2 = false,
		showBlockBackground = false,
		blockInnerWidth = '',
	} = blockProps.attributes

	const borderRadius = ( ! showBlockBackground && align !== 'full' ) || ( showBlockBackground && blockInnerWidth !== 'full' )

	return applyFilters( 'stackable.header.show', {
		columnBackground: design !== 'plain',
		borderRadius: design !== 'plain' && borderRadius,
		titleSpacing: showTitle,
		subtitleSpacing: showSubtitle,
		buttonSpacing: showButton || showButton2,
		buttonGap: showButton && showButton2,
		restrictContent: ( ! showBlockBackground && align === 'full' ) || ( showBlockBackground && blockInnerWidth === 'full' ),
		overlayBackground: design.match( /overlay/ ),
	}, blockProps )
}
