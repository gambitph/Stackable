/**
 * External dependencies
 */
import {
	Advanced,
	Typography,
	Alignment,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

Alignment.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-icon-list-item__text',
	hoverSelector: '.stk-block-icon-list-item__text:hover',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
