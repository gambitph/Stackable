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

Divider.addStyles( blockStyles )
ContainerDiv.addStyles( blockStyles )
Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-countdown__digit',
	hoverSelector: '.stk-block-countdown__digit:hover',
	attrNameTemplate: 'digit%s',
} )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-countdown__label',
	hoverSelector: '.stk-block-countdown__label:hover',
	attrNameTemplate: 'label%s',
} )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-countdown__message',
	hoverSelector: '.stk-block-countdown__message:hover',
	attrNameTemplate: 'message%s',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
