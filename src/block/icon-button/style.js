
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const buttonOptions = {
	selector: '.stk-button',
	hoverSelector: '.stk-button:hover',
	textSelector: '.stk-button__inner-text',
	textHoverSelector: '.stk-button:hover .stk-button__inner-text',
}

export const IconButtonStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Button.Style { ...props } { ...buttonOptions } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

IconButtonStyles.defaultProps = {
	version: '',
}

IconButtonStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<Button.Style.Content { ...props } { ...buttonOptions } />
			<EffectsAnimations.Style.Content { ...props } />
		</BlockCssCompiler>
	)
}

IconButtonStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
