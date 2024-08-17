/**
 * WordPress dependencies
 */
import { applyFilters, doAction } from '@wordpress/hooks'

export const Style = props => {
	const EffectStyles = applyFilters( 'stackable.block-component.effects-animations.style', null )
	return EffectStyles && <EffectStyles { ...props } />
}

Style.Content = props => {
	const EffectStyles = applyFilters( 'stackable.block-component.effects-animations.style.content', null )
	return EffectStyles && <EffectStyles { ...props } />
}

Style.addStyles = ( blockStyleGenerator, props = {} ) => {
	doAction( 'stackable.block-component.effects-animations.style.addStyles', blockStyleGenerator, props )
}
