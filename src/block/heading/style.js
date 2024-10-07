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

blockStyles.addBlockStyles( 'topLineHeight', [ {
	selector: '.stk-block-heading__top-line',
	styleRule: 'height',
	attrName: 'topLineHeight',
	key: 'topLineHeight',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'topLineWidth', [ {
	selector: '.stk-block-heading__top-line',
	styleRule: 'width',
	attrName: 'topLineWidth',
	key: 'topLineWidth',
	hasUnits: 'px',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'topLineColor', [ {
	selector: '.stk-block-heading__top-line',
	styleRule: 'backgroundColor',
	attrName: 'topLineColor',
	key: 'topLineColor',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'topLineMargin', [ {
	selector: '.stk-block-heading__top-line',
	styleRule: 'marginBottom',
	attrName: 'topLineMargin',
	key: 'topLineMargin',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'topLineAlign', [ {
	selector: '.stk-block-heading__top-line',
	styleRule: 'marginLeft',
	attrName: 'topLineAlign',
	key: 'topLineAlign-left',
	responsive: 'all',
	valueCallback: value => value === 'center' || value === 'right' ? 'auto' : '0',
}, {
	selector: '.stk-block-heading__top-line',
	styleRule: 'marginRight',
	attrName: 'topLineAlign',
	key: 'topLineAlign',
	responsive: 'all',
	valueCallback: value => value === 'center' || value === 'left' ? 'auto' : '0',
} ] )

blockStyles.addBlockStyles( 'bottomLineHeight', [ {
	selector: '.stk-block-heading__bottom-line',
	styleRule: 'height',
	attrName: 'bottomLineHeight',
	key: 'bottomLineHeight',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'bottomLineWidth', [ {
	selector: '.stk-block-heading__bottom-line',
	styleRule: 'width',
	attrName: 'bottomLineWidth',
	key: 'bottomLineWidth',
	hasUnits: 'px',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'bottomLineColor', [ {
	selector: '.stk-block-heading__bottom-line',
	styleRule: 'backgroundColor',
	attrName: 'bottomLineColor',
	key: 'bottomLineColor',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'bottomLineMargin', [ {
	selector: '.stk-block-heading__bottom-line',
	styleRule: 'marginTop',
	attrName: 'bottomLineMargin',
	key: 'bottomLineMargin',
	responsive: 'all',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'bottomLineAlign', [ {
	selector: '.stk-block-heading__bottom-line',
	styleRule: 'marginLeft',
	attrName: 'bottomLineAlign',
	key: 'bottomLineAlign',
	responsive: 'all',
	valueCallback: value => value === 'center' || value === 'right' ? 'auto' : 0,
}, {
	selector: '.stk-block-heading__bottom-line',
	styleRule: 'marginRight',
	attrName: 'bottomLineAlign',
	key: 'bottomLineAlign-right',
	responsive: 'all',
	valueCallback: value => value === 'center' || value === 'left' ? 'auto' : 0,
} ] )

Alignment.addStyles( blockStyles )
BlockDiv.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
Typography.addStyles( blockStyles, {
	selector: '.stk-block-heading__text',
	hoverSelector: '.stk-block-heading__text:hover',
} )
EffectsAnimations.addStyles( blockStyles )

export default blockStyles
