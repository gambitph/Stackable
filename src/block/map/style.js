/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { attributeHasValue } from '~stackable/util'

const Styles = props => {
	const propsToPass = {
		...props,
		version: props.version,
		versionAdded: '3.0.0',
		versionDeprecated: '',
	}
	const {
		attributes,
	} = props

	return (
		<>
			{ attributeHasValue( 'height', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="edit"
					selector=".stk-block-map__canvas"
					styleRule="height"
					attrName="height"
					format="%spx"
					responsive="all"
				/>
			}
			{ attributeHasValue( 'height', attributes, { hasResponsive: true } ) &&
				<BlockCss
					{ ...propsToPass }
					renderIn="save"
					selector=".stk-block-map__canvas, iframe"
					styleRule="height"
					attrName="height"
					format="%spx"
					responsive="all"
				/>
			}
		</>
	)
}

const BlockStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
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
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

BlockStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default BlockStyles
