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
import { useBlockAttributesContext } from '~stackable/hooks'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const alignmentOptions = {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
}

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.8.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				{ ...propsToPass }
				styleRule="--slides-to-show"
				attrName="slidesToShow"
				key="slidesToShow"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--gap"
				attrName="slideColumnGap"
				key="slideColumnGap"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--transition-duration"
				attrName="fadeDuration"
				key="fadeDuration"
				format="%ss"
			/>

			{ /* Arrows */ }
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__buttons"
				styleRule="justifyContent"
				attrName="arrowJustify"
				key="arrowJustify"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__buttons"
				styleRule="alignItems"
				attrName="arrowAlign"
				key="arrowAlign"
				enabledCallback={ getAttribute => getAttribute( 'arrowPosition' ) !== 'outside' }
				dependencies={ [ 'arrowPosition' ] }
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--button-offset"
				attrName="arrowButtonOffset"
				key="arrowButtonOffset"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--button-gap"
				attrName="arrowButtonGap"
				key="arrowButtonGap"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__button"
				hoverSelector=".stk-block-carousel__button:hover"
				styleRule="background"
				attrName="arrowButtonColor"
				key="arrowButtonColor"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__button"
				hoverSelector=".stk-block-carousel__button:hover"
				styleRule="fill"
				attrName="arrowIconColor"
				key="arrowIconColor"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__button svg.ugb-custom-icon :is(g,path,rect,polygon,ellipse)"
				hoverSelector=".stk-block-carousel__button svg.ugb-custom-icon :is(g,path,rect,polygon,ellipse):hover"
				styleRule="fill"
				attrName="arrowIconColor"
				key="arrowIconColor"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--button-width"
				attrName="arrowWidth"
				key="arrowWidth"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--button-height"
				attrName="arrowHeight"
				key="arrowHeight"
				hasUnits="px"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__button"
				styleRule="borderRadius"
				attrName="arrowBorderRadius"
				key="arrowBorderRadius"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__button svg"
				styleRule="width"
				attrName="arrowIconSize"
				key="arrowIconSize-width"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__button svg"
				styleRule="height"
				attrName="arrowIconSize"
				key="arrowIconSize-height"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__button"
				hoverSelector=".stk-block-carousel__button:hover"
				styleRule="opacity"
				attrName="arrowOpacity"
				key="arrowOpacity"
				hover="all"
			/>

			{ /* Dots */ }
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__dots"
				styleRule="justifyContent"
				attrName="dotsJustify"
				key="dotsJustify"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__dots"
				styleRule="--dot-offset"
				attrName="dotsOffset"
				key="dotsOffset"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--dot-gap"
				attrName="dotsGap"
				key="dotsGap"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__dot"
				hoverSelector=".stk-block-carousel__dot"
				styleRule="--dot-color"
				hoverStyleRule="--dot-color-hover"
				attrName="dotsColor"
				key="dotsColor"
				hover="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__dot.stk-block-carousel__dot--active:before"
				styleRule="backgroundColor"
				attrName="dotsActiveColor"
				key="dotsActiveColor"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--dot-size"
				attrName="dotsSize"
				key="dotsSize"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-carousel__dot:before"
				styleRule="borderRadius"
				attrName="dotsBorderRadius"
				key="dotsBorderRadius"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--dot-active-width"
				attrName="dotsActiveWidth"
				key="dotsActiveWidth"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				styleRule="--dot-active-height"
				attrName="dotsActiveHeight"
				key="dotsActiveHeight"
				format="%spx"
			/>
		</>
	)
}

const BlockStyles = memo( props => {
	const columnArrangement = useBlockAttributesContext( attributes => attributes.columnArrangementMobile || attributes.columnArrangementTablet )
	const numColumns = ( columnArrangement || '' ).split( ',' ).length

	const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )

	return (
		<>
			<Alignment.Style { ...props } { ...alignmentOptions } />
			<BlockDiv.Style { ...props } />
			<MarginBottom.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Separator.Style { ...props } />
			<Styles { ...props } />
			{ ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> }
		</>
	)
} )

BlockStyles.defaultProps = {
	version: '',
}

BlockStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	const numColumns = ( props.attributes.columnArrangementMobile || props.attributes.columnArrangementTablet || '' ).split( ',' ).length
	const ColumnOrderStyle = applyFilters( 'stackable.block-component.columns.column-order-style', null )

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } { ...alignmentOptions } />
			<BlockDiv.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Separator.Style.Content { ...props } />
			<Styles { ...props } />
			{ ColumnOrderStyle && <ColumnOrderStyle { ...props } numColumns={ numColumns } /> }
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
