import { addAttributes } from './attributes'
import { Edit } from './edit'
import { Style } from './style'

import { applyFilters } from '@wordpress/hooks'
import domReady from '@wordpress/dom-ready'

let CALL_COUNT = 0

/**
 * Append the `.stk--anim-init` in the editor.
 */
if ( CALL_COUNT === 0 ) {
	domReady( () => {
		requestAnimationFrame( () => {
			document.body.classList.add( 'stk--anim-init' )
			CALL_COUNT++
		} )
	} )
}

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

EffectsAnimations.Style = Style
