
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	Typography,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockCss, BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const buttonOptions = {
	selector: '.stk-button',
}

const typographyOptions = {
	selector: '.stk-button__inner-text',
	hoverSelector: '.stk-button:hover .stk-button__inner-text',
}

const _Styles = props => {
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
				// This makes the block fullwidth inside the editor.
				renderIn="edit"
				selectorCallback={ ( getAttributes, attributes, clientId ) => `.editor-styles-wrapper [data-block="${ clientId }"]` }
				styleRule="width"
				attrName="buttonFullWidth"
				key="buttonFullWidth"
				valueCallback={ value => {
					return value ? '100%' : undefined
				} }
			/>
		</>
	)
}

const Styles = memo( _Styles )
Styles.Content = _Styles

export const ButtonStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Button.Style { ...props } { ...buttonOptions } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<EffectsAnimations.Style { ...props } />
			<Styles { ...props } />
		</>
	)
} )

ButtonStyles.defaultProps = {
	version: '',
}

ButtonStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Button.Style.Content { ...props } { ...buttonOptions } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
			<EffectsAnimations.Style.Content { ...props } />
			<Styles.Content { ...props } />
		</BlockCssCompiler>
	)
}

ButtonStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
