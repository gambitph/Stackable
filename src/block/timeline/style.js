/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Transform,
	Typography,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const typographyOptions = {
	selector: '.stk-block-timeline__date',
	hoverSelector: '.stk-block-timeline__date:hover',
}

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
				{ ...propsToPass }
				selector=""
				styleRule="--line-accent-bg-location"
				attrName="timelineAnchor"
				key="timelineAnchor"
				format="%s%"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--gap"
				attrName="timelineGap"
				key="timelineGap"
				responsive="all"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-dot-border-radius"
				attrName="timelineDotBorderRadius"
				key="timelineDotBorderRadius"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-dot-size"
				attrName="timelineDotSize"
				key="timelineDotSize"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-bg-width"
				attrName="timelineThickness"
				key="timelineThickness"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--content-line"
				attrName="timelineOffset"
				key="timelineOffset"
				format="%spx"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-accent-bg-color"
				attrName="timelineAccentColor"
				key="timelineAccentColor"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="--line-bg-color"
				attrName="timelineBackgroundColor"
				key="timelineBackgroundColor"
			/>
		</>
	)
}

const BlockStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<MarginBottom.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<Styles { ...props } />
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

	return (
		<BlockCssCompiler>
			<BlockDiv.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
