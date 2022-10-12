/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}

	return (
		<>
			<BlockCss
				selector=".stk-block-heading__top-line"
				styleRule="height"
				attrName="topLineHeight"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__top-line"
				styleRule="width"
				attrName="topLineWidth"
				hasUnits="px"
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__top-line"
				styleRule="backgroundColor"
				attrName="topLineColor"
				hover="all"

				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__top-line"
				styleRule="backgroundColor"
				attrName="topLineColor"
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__top-line"
				styleRule="marginBottom"
				attrName="topLineMargin"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__top-line"
				styleRule="marginLeft"
				attrName="topLineAlign"
				responsive="all"
				valueCallback={ value => value === 'center' || value === 'right' ? 'auto' : '0' }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__top-line"
				styleRule="marginRight"
				attrName="topLineAlign"
				responsive="all"
				valueCallback={ value => value === 'center' || value === 'left' ? 'auto' : '0' }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__bottom-line"
				styleRule="height"
				attrName="bottomLineHeight"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__bottom-line"
				styleRule="width"
				attrName="bottomLineWidth"
				hasUnits="px"
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__bottom-line"
				styleRule="backgroundColor"
				attrName="bottomLineColor"
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__bottom-line"
				styleRule="backgroundColor"
				attrName="bottomLineColor"
				hover="all"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__bottom-line"
				styleRule="marginTop"
				attrName="bottomLineMargin"
				responsive="all"
				format="%spx"
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__bottom-line"
				styleRule="marginLeft"
				attrName="bottomLineAlign"
				responsive="all"
				valueCallback={ value => value === 'center' || value === 'right' ? 'auto' : undefined }
				{ ...propsToPass }
			/>
			<BlockCss
				selector=".stk-block-heading__bottom-line"
				styleRule="marginRight"
				attrName="bottomLineAlign"
				responsive="all"
				valueCallback={ value => value === 'center' || value === 'left' ? 'auto' : undefined }
				{ ...propsToPass }
			/>
		</>
	)
}

export const HeadingStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } verticalAlignRule="justifyContent" />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Typography.Style { ...props } selector=".stk-block-heading__text" />
			<Styles { ...props } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

HeadingStyles.defaultProps = {
	version: '',
}

HeadingStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } verticalAlignRule="justifyContent" />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Typography.Style.Content { ...props } selector=".stk-block-heading__text" />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

HeadingStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
