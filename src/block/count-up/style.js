/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-count-up__text',
	hoverSelector: '.stk-block-count-up__text:hover',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
