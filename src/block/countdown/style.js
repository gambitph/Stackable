import { Divider } from './divider'

/**
 * External dependencies
 */
import {
	BlockDiv,
	ContainerDiv,
	Advanced,
	Alignment,
	EffectsAnimations,
	Transform,
	Typography,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'contentAlignment', [ {
	selector: '.%s.stk-block-countdown .stk-block-countdown__container',
	styleRule: 'display',
	responsive: 'all',
	attrName: 'contentAlignment',
	valueCallback: () => {
		return 'flex'
	},
}, {
	selector: '.%s.stk-block-countdown .stk-block-countdown__container',
	styleRule: 'justifyContent',
	attrName: 'contentAlignment',
	key: 'contentAlignment',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'boxGap', [ {
	selector: '.%s.stk-block-countdown .stk-block-countdown__container',
	styleRule: 'gap',
	attrName: 'boxGap',
	key: 'boxGap',
	responsive: 'all',
	hasUnits: 'px',
} ] )

blockStyles.addBlockStyles( 'labelMarginTop', [ {
	selector: '.stk-block-countdown__label',
	styleRule: 'marginTop',
	attrName: 'labelMarginTop',
	key: 'labelMarginTop',
	responsive: 'all',
	hasUnits: 'px',
} ] )

Divider.Style.addStyles( blockStyles )
ContainerDiv.Style.addStyles( blockStyles )
Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-block-countdown__digit',
	hoverSelector: '.stk-block-countdown__digit:hover',
	attrNameTemplate: 'digit%s',
} )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-block-countdown__label',
	hoverSelector: '.stk-block-countdown__label:hover',
	attrNameTemplate: 'label%s',
} )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-block-countdown__message',
	hoverSelector: '.stk-block-countdown__message:hover',
	attrNameTemplate: 'message%s',
} )
EffectsAnimations.Style.addStyles( blockStyles )

export default blockStyles
