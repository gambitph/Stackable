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

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-img-figcaption',
	hoverSelector: '.stk-img-figcaption:hover',
	attrNameTemplate: 'figcaption%s',
} )
EffectsAnimations.Style.addStyles( blockStyles )
Image.Style.addStyles( blockStyles )

export default blockStyles
