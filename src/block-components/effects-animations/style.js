/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const Style = props => {
	return applyFilters( 'stackable.block-component.effects-animations.style', null, props )
}

Style.Content = props => {
	return applyFilters( 'stackable.block-component.effects-animations.style.content', null, props )
}
