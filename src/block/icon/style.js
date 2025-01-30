/**
 * External dependencies
 */
import {
	Icon,
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
Icon.addStyles( blockStyles, {
	selector: '.stk--svg-wrapper',
	hoverSelector: '.stk--svg-wrapper:hover',
} )

export default blockStyles
