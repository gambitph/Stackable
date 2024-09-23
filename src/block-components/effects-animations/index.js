import { addAttributes } from './attributes'
import { Edit } from './edit'
import { addStyles } from './style'

import { applyFilters } from '@wordpress/hooks'

export const EffectsAnimations = props => {
	return applyFilters( 'stackable.block-component.effects-animations', null, props )
}

EffectsAnimations.defaultProps = {
	mainBlockClass: '',
}

EffectsAnimations.Content = props => {
	return applyFilters( 'stackable.block-component.effects-animations.content', null, props )
}

EffectsAnimations.Content.defaultProps = {
	attributes: {},
}

EffectsAnimations.InspectorControls = Edit

EffectsAnimations.addAttributes = addAttributes

EffectsAnimations.addStyles = addStyles
