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

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-block-count-up__text',
	hoverSelector: '.stk-block-count-up__text:hover',
} )
EffectsAnimations.Style.addStyles( blockStyles )

export default blockStyles
