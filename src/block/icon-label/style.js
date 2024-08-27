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

blockStyles.addBlockStyles( 'iconGap2', [ {
	renderIn: 'save',
	selector: '.stk-inner-blocks',
	attrName: 'iconGap2',
	key: 'iconGap-save',
	styleRule: 'gap',
	format: '%spx',
	responsive: 'all',
}, {
	renderIn: 'edit',
	selector: '.stk-inner-blocks .block-editor-block-list__layout',
	attrName: 'iconGap2',
	key: 'iconGap',
	styleRule: 'gap',
	format: '%spx',
	responsive: 'all',
} ] )

Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Column.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )

export default blockStyles
