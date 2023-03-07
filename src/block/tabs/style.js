/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
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
				{ ...propsToPass }
				selector=""
				styleRule="columnCount"
				attrName="columns"
				key="columns"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=""
				styleRule="columnGap"
				attrName="columnGap"
				key="columnGap"
				responsive="all"
				format="%spx"
			/>
		</>
	)
}

export const TabsStyle = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Styles { ...props } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

TabsStyle.defaultProps = {
	version: '',
}

TabsStyle.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

TabsStyle.Content.defaultProps = {
	version: '',
	attributes: {},
}

