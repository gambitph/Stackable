/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	Image,
	Transform,
	Typography,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'figcaptionAlignment', [ {
	selector: '.%s .stk-img-figcaption',
	styleRule: 'textAlign',
	attrName: 'figcaptionAlignment',
} ] )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Typography.addStyles( blockStyles, {
	selector: '.stk-img-figcaption',
	hoverSelector: '.stk-img-figcaption:hover',
	attrNameTemplate: 'figcaption%s',
} )
EffectsAnimations.addStyles( blockStyles )
Image.addStyles( blockStyles )

export default blockStyles
