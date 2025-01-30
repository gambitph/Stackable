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
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'columns', [ {
	selector: '',
	styleRule: 'columnCount',
	attrName: 'columns',
	key: 'columns',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'columnGap', [ {
	selector: '',
	styleRule: 'columnGap',
	attrName: 'columnGap',
	key: 'columnGap',
	responsive: 'all',
	format: '%spx',
} ] )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-text__text',
	hoverSelector: '.stk-block-text__text:hover',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
