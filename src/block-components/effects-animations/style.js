/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'
import { memo } from '@wordpress/element'

export const Style = memo( props => {
	const EffectStyles = applyFilters( 'stackable.block-component.effects-animations.style', null )
	return EffectStyles && <EffectStyles { ...props } />
} )

Style.Content = props => {
	const EffectStyles = applyFilters( 'stackable.block-component.effects-animations.style.content', null )
	return EffectStyles && <EffectStyles { ...props } />
}
