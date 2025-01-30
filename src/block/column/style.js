/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
	ContainerDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockStyleGenerator } from '~stackable/components'

const callbacks = {
	marginTop: {
		valuePreCallback: value => value?.top,
	},
	marginRight: {
		valuePreCallback: value => value?.right,
	},
	marginBottom: {
		valuePreCallback: value => value?.bottom,
	},
	marginLeft: {
		valuePreCallback: value => value?.left,
	},
}

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'columnSpacing', [ {
	selector: '.%s-container',
	styleRule: 'marginTop',
	attrName: 'columnSpacing',
	key: 'columnSpacing-top',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginTop.valuePreCallback,
},
{
	selector: '.%s-container',
	styleRule: 'marginRight',
	attrName: 'columnSpacing',
	key: 'columnSpacing-right',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginRight.valuePreCallback,
},
{
	selector: '.%s-container',
	styleRule: 'marginBottom',
	attrName: 'columnSpacing',
	key: 'columnSpacing-bottom',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginBottom.valuePreCallback,
},
{
	selector: '.%s-container',
	styleRule: 'marginLeft',
	attrName: 'columnSpacing',
	key: 'columnSpacing-left',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginLeft.valuePreCallback,
},

// The styles below are used purely for the block highligher feature
// where the edges of the element where the padding will be applied
// is highlighted.

{
	renderIn: 'edit',
	selector: '.%s-container',
	styleRule: '--column-spacing-top',
	attrName: 'columnSpacing',
	key: 'columnSpacing-top-edit-for-highlight',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginTop.valuePreCallback,
},
{
	renderIn: 'edit',
	selector: '.%s-container',
	styleRule: '--column-spacing-right',
	attrName: 'columnSpacing',
	key: 'columnSpacing-right-edit-for-highlight',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginRight.valuePreCallback,
},
{
	renderIn: 'edit',
	selector: '.%s-container',
	styleRule: '--column-spacing-bottom',
	attrName: 'columnSpacing',
	key: 'columnSpacing-bottom-edit-for-highlight',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginBottom.valuePreCallback,
},
{
	renderIn: 'edit',
	selector: '.%s-container',
	styleRule: '--column-spacing-left',
	attrName: 'columnSpacing',
	key: 'columnSpacing-left-edit-for-highlight',
	responsive: 'all',
	hasUnits: 'px',
	valuePreCallback: callbacks.marginLeft.valuePreCallback,
} ] )

Alignment.addStyles( blockStyles, {
	columnAlignSelectorEditCallback: ( getAttributes, attributes, clientId ) => `[data-block="${ clientId }"]`,
} )
BlockDiv.addStyles( blockStyles )
Column.addStyles( blockStyles )
ContainerDiv.addStyles( blockStyles, {
	sizeSelector: '.%s-container',
	sizeHorizontalAlignRule: 'margin',
	sizeVerticalAlignRule: 'justifyContent',
	sizeVerticalAlignSelector: '.%s-inner-blocks',
	// sizeVerticalAlignSelectorEdit: '.%s-inner-blocks > .block-editor-inner-blocks > .block-editor-block-list__layout',
	// sizeVerticalAlignSelectorEdit: '.%s-inner-blocks',
} )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
