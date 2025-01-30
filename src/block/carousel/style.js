/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Separator,
	Transform,
} from '~stackable/block-components'
// import { useBlockAttributesContext } from '~stackable/hooks'
// import { applyFilters } from '@wordpress/hooks'
import { BlockStyleGenerator } from '~stackable/components'

const blockStyles = new BlockStyleGenerator( {
	versionAdded: '3.0.0',
	versionDeprecated: '',
} )

blockStyles.addBlockStyles( 'slidesToShow', [ {
	styleRule: '--slides-to-show',
	attrName: 'slidesToShow',
	key: 'slidesToShow',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'slideColumnGap', [ {
	styleRule: '--gap',
	attrName: 'slideColumnGap',
	key: 'slideColumnGap',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'fadeDuration', [ {
	styleRule: '--transition-duration',
	attrName: 'fadeDuration',
	key: 'fadeDuration',
	format: '%ss',
} ] )

{ /* Arrows */ }
blockStyles.addBlockStyles( 'arrowJustify', [ {
	selector: '.stk-block-carousel__buttons',
	styleRule: 'justifyContent',
	attrName: 'arrowJustify',
	key: 'arrowJustify',
} ] )

blockStyles.addBlockStyles( 'arrowAlign', [ {
	selector: '.stk-block-carousel__buttons',
	styleRule: 'alignItems',
	attrName: 'arrowAlign',
	key: 'arrowAlign',
	enabledCallback: getAttribute => getAttribute( 'arrowPosition' ) !== 'outside',
	dependencies: [ 'arrowPosition' ],
} ] )

blockStyles.addBlockStyles( 'arrowButtonOffset', [ {
	styleRule: '--button-offset',
	attrName: 'arrowButtonOffset',
	key: 'arrowButtonOffset',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'arrowButtonGap', [ {
	styleRule: '--button-gap',
	attrName: 'arrowButtonGap',
	key: 'arrowButtonGap',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'arrowButtonColor', [ {
	selector: '.stk-block-carousel__button',
	hoverSelector: '.stk-block-carousel__button:hover',
	styleRule: 'background',
	attrName: 'arrowButtonColor',
	key: 'arrowButtonColor',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'arrowIconColor', [ {
	selector: '.stk-block-carousel__button',
	hoverSelector: '.stk-block-carousel__button:hover',
	styleRule: 'fill',
	attrName: 'arrowIconColor',
	key: 'arrowIconColor',
	hover: 'all',
}, {
	selector: '.stk-block-carousel__button svg.ugb-custom-icon :is(g,path,rect,polygon,ellipse)',
	hoverSelector: '.stk-block-carousel__button svg.ugb-custom-icon :is(g,path,rect,polygon,ellipse):hover',
	styleRule: 'fill',
	attrName: 'arrowIconColor',
	key: 'arrowIconColor',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'arrowWidth', [ {
	styleRule: '--button-width',
	attrName: 'arrowWidth',
	key: 'arrowWidth',
	hasUnits: 'px',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'arrowHeight', [ {
	styleRule: '--button-height',
	attrName: 'arrowHeight',
	key: 'arrowHeight',
	hasUnits: 'px',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'arrowBorderRadius', [ {
	selector: '.stk-block-carousel__button',
	styleRule: 'borderRadius',
	attrName: 'arrowBorderRadius',
	key: 'arrowBorderRadius',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'arrowIconSize', [ {
	selector: '.stk-block-carousel__button svg',
	styleRule: 'width',
	attrName: 'arrowIconSize',
	key: 'arrowIconSize-width',
	format: '%spx',
	responsive: 'all',
}, {
	selector: '.stk-block-carousel__button svg',
	styleRule: 'height',
	attrName: 'arrowIconSize',
	key: 'arrowIconSize-height',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'arrowOpacity', [ {
	selector: '.stk-block-carousel__button',
	hoverSelector: '.stk-block-carousel__button:hover',
	styleRule: 'opacity',
	attrName: 'arrowOpacity',
	key: 'arrowOpacity',
	hover: 'all',
} ] )

{ /* Dots */ }
blockStyles.addBlockStyles( 'dotsJustify', [ {
	selector: '.stk-block-carousel__dots',
	styleRule: 'justifyContent',
	attrName: 'dotsJustify',
	key: 'dotsJustify',
} ] )

blockStyles.addBlockStyles( 'dotsOffset', [ {
	selector: '.stk-block-carousel__dots',
	styleRule: '--dot-offset',
	attrName: 'dotsOffset',
	key: 'dotsOffset',
	format: '%spx',
	responsive: 'all',
} ] )

blockStyles.addBlockStyles( 'dotsGap', [ {
	styleRule: '--dot-gap',
	attrName: 'dotsGap',
	key: 'dotsGap',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'dotsColor', [ {
	selector: '.stk-block-carousel__dot',
	hoverSelector: '.stk-block-carousel__dot',
	styleRule: '--dot-color',
	hoverStyleRule: '--dot-color-hover',
	attrName: 'dotsColor',
	key: 'dotsColor',
	hover: 'all',
} ] )

blockStyles.addBlockStyles( 'dotsActiveColor', [ {
	selector: '.stk-block-carousel__dot.stk-block-carousel__dot--active:before',
	styleRule: 'backgroundColor',
	attrName: 'dotsActiveColor',
	key: 'dotsActiveColor',
} ] )

blockStyles.addBlockStyles( 'dotsSize', [ {
	styleRule: '--dot-size',
	attrName: 'dotsSize',
	key: 'dotsSize',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'dotsBorderRadius', [ {
	selector: '.stk-block-carousel__dot:before',
	styleRule: 'borderRadius',
	attrName: 'dotsBorderRadius',
	key: 'dotsBorderRadius',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'dotsActiveWidth', [ {
	styleRule: '--dot-active-width',
	attrName: 'dotsActiveWidth',
	key: 'dotsActiveWidth',
	format: '%spx',
} ] )

blockStyles.addBlockStyles( 'dotsActiveHeight', [ {
	styleRule: '--dot-active-height',
	attrName: 'dotsActiveHeight',
	key: 'dotsActiveHeight',
	format: '%spx',
} ] )

Alignment.addStyles( blockStyles, {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
} )
BlockDiv.addStyles( blockStyles )
MarginBottom.addStyles( blockStyles )
Advanced.addStyles( blockStyles )
Transform.addStyles( blockStyles )
EffectsAnimations.addStyles( blockStyles )
Separator.addStyles( blockStyles )

export default blockStyles
