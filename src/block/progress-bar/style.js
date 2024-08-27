/**
 * External dependencies
 */
import {
	Alignment,
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
	ProgressBar,
	Typography,
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
ProgressBar.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-progress-bar__inner-text',
	hoverSelector: '.stk-progress-bar__inner-text:hover',
} )

export default blockStyles
