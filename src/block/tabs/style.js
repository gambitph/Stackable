/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Separator,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'tabPanelOffset', [ {
	selector: '',
	styleRule: '--tabs-gap',
	attrName: 'tabPanelOffset',
	key: 'tabPanelOffset',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'equalTabHeight', [ {
	selector: '.%s .stk-block-tab-content .stk-block-content .stk-block-column[hidden]',
	renderIn: 'save',
	styleRule: 'display',
	attrName: 'equalTabHeight',
	key: 'equalTabHeight',
	valueCallback: value => {
		return value ? undefined : 'none'
	},
	responsive: 'all',
} ] )

BlockDiv.addStyles( blockStyles )
MarginBottom.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
Separator.addStyles( blockStyles )

export default blockStyles
