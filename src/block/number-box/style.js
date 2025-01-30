/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	EffectsAnimations,
	addBackgroundStyles,
	addBorderStyles,
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

addBackgroundStyles( blockStyles, {
	attrNameTemplate: 'shape%s',
	selector: '.stk-block-number-box__text',
	renderCondition: 'hasShape',
} )
addBorderStyles( blockStyles, {
	attrNameTemplate: 'shape%s',
	selector: '.stk-block-number-box__text',
	renderCondition: 'hasShape',
} )
Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-number-box__text',
	hoverSelector: '.stk-block-number-box__text:hover',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
