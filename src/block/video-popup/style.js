/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'iconGap', [ {
	selector: '.stk-block-icon',
	attrName: 'iconGap',
	key: 'iconGap',
	styleRule: 'flexBasis',
	format: '%spx',
} ] )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Column.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
