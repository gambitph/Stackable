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

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
ProgressBar.addStyles( blockStyles, {
	isCircle: true,
} )
Typography.addStyles( blockStyles, {
	selector: '.stk-progress-circle__inner-text',
	hoverSelector: '.stk-progress-circle__inner-text:hover',
} )

export default blockStyles
