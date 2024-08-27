/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	EffectsAnimations,
	BackgroundStyle,
	BorderStyle,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'shapeSize', [ {
	selector: '.stk-block-number-box__text',
	styleRule: 'height',
	attrName: 'shapeSize',
	key: 'shapeSize',
	responsive: 'all',
	hasUnits: 'px',
	enabledCallback: getAttribute => getAttribute( 'hasShape' ),
	dependencies: [ 'hasShape' ],
}, {
	selector: '.stk-block-number-box__text',
	styleRule: 'width',
	attrName: 'shapeSize',
	key: 'shapeSize-width',
	responsive: 'all',
	hasUnits: 'px',
	enabledCallback: getAttribute => getAttribute( 'hasShape' ),
	dependencies: [ 'hasShape' ],
} ] )

BackgroundStyle.addStyles( blockStyles, {
	attrNameTemplate: 'shape%s',
	selector: '.stk-block-number-box__text',
	renderCondition: 'hasShape',
} )
BorderStyle.addStyles( blockStyles, {
	attrNameTemplate: 'shape%s',
	selector: '.stk-block-number-box__text',
	renderCondition: 'hasShape',
} )
Alignment.Style.addStyles( blockStyles )
BlockDiv.Style.addStyles( blockStyles )
Advanced.Style.addStyles( blockStyles )
Transform.Style.addStyles( blockStyles )
Typography.Style.addStyles( blockStyles, {
	selector: '.stk-block-number-box__text',
	hoverSelector: '.stk-block-number-box__text:hover',
} )
EffectsAnimations.Style.addStyles( blockStyles )

export default blockStyles
