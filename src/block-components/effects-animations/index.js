import { addAttributes } from './attributes'
import { Edit } from './edit'
import { addStyles } from './style'

import { applyFilters } from '@wordpress/hooks'
import { getPropsWithDefaults } from '../../util/props'

export const EffectsAnimations = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, EFFECTS_ANIMATIONS_DEFAULT_PROPS )
	return applyFilters( 'stackable.block-component.effects-animations', null, props )
}

const EFFECTS_ANIMATIONS_DEFAULT_PROPS = {
	mainBlockClass: '',
}

EffectsAnimations.Content = incomingProps => {
	const props = getPropsWithDefaults( incomingProps, EFFECTS_ANIMATIONS_CONTENT_DEFAULT_PROPS )
	return applyFilters( 'stackable.block-component.effects-animations.content', null, props )
}

const EFFECTS_ANIMATIONS_CONTENT_DEFAULT_PROPS = {
	attributes: {},
}

EffectsAnimations.InspectorControls = Edit

EffectsAnimations.addAttributes = addAttributes

EffectsAnimations.addStyles = addStyles
