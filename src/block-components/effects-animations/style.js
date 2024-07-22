/**
 * WordPress dependencies
 */
import { applyFilters } from '@wordpress/hooks'

export const Style = props => {
	const EffectStyles = applyFilters( 'stackable.block-component.effects-animations.style', null )
	return EffectStyles && <EffectStyles { ...props } />
}

Style.Content = props => {
	const EffectStyles = applyFilters( 'stackable.block-component.effects-animations.style.content', null )
	return EffectStyles && <EffectStyles { ...props } />
}
