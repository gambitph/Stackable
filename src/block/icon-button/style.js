
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Button.addStyles( blockStyles, {
	selector: '.stk-button',
	hoverSelector: '.stk-button:hover',
	textSelector: '.stk-button__inner-text',
	textHoverSelector: '.stk-button:hover .stk-button__inner-text',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
