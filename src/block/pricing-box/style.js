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

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
ContainerDiv.Style.addStyles( blockStyles )
MarginBottom.Style.addStyles( blockStyles )

export default blockStyles
