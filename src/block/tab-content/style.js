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
import { BlockCssCompiler, BlockCss } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const alignmentOptions = {
	editorSelectorCallback: getAttribute => `.stk--block-align-${ getAttribute( 'uniqueId' ) } > .block-editor-inner-blocks > .block-editor-block-list__layout`,
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
				selector=".%s > .stk-block-content > .stk-block-column[hidden]"
				renderIn="save"
				styleRule="display"
				attrName="equalTabHeight"
				key="equalTabHeight"
				valueCallback={ () => {
					return 'none'
				} }
				responsive="all"
			/>
		</>
	)
}

const BlockStyles = memo( props => {
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
			<Alignment.Style.Content { ...props } { ...alignmentOptions } />
			<BlockDiv.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Separator.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
