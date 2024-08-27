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

BlockDiv.Style.addStyles( blockStyles )
MarginBottom.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
EffectsAnimations.Style.addStyles( blockStyles )
Separator.Style.addStyles( blockStyles )

export default blockStyles
