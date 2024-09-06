/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	ContainerDiv,
	EffectsAnimations,
	MarginBottom,
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
ContainerDiv.addStyles( blockStyles )
MarginBottom.addStyles( blockStyles )

export default blockStyles
