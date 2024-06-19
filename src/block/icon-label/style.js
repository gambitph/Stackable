/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	Column,
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
			{ /* For the old icon gap */ }
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-block-icon"
				attrName="iconGap"
				key="iconGap-save"
				styleRule="flexBasis"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector={ `.stk-inner-blocks [data-block][data-type="stackable/icon"]` }
				attrName="iconGap"
				key="iconGap"
				styleRule="flexBasis"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="save"
				selector=".stk-inner-blocks"
				attrName="iconGap2"
				key="iconGap-save"
				styleRule="gap"
				format="%spx"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				renderIn="edit"
				selector=".stk-inner-blocks .block-editor-block-list__layout"
				attrName="iconGap2"
				key="iconGap"
				styleRule="gap"
				format="%spx"
				responsive="all"
			/>
		</>
	)
}

export const IconLabelStyles = memo( props => {
	return (
		<>
			{ /* Alignment has been removed in 3.3.0, but retained here to prevent block errors */ }
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Column.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Styles { ...props } />
		</>
	)
} )

IconLabelStyles.defaultProps = {
	version: '',
}

IconLabelStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			{ /* Alignment has been removed in 3.3.0, but retained here to prevent block errors */ }
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<Column.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

IconLabelStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
