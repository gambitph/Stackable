/**
 * External dependencies
 */
import {
	Icon,
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	Transform,
} from '~stackable/block-components'
import { BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const iconStyleOptions = {
	selector: '.stk--svg-wrapper',
	hoverSelector: '.stk--svg-wrapper:hover',
}

export const IconStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Icon.Style { ...props } { ...iconStyleOptions } />
		</>
	)
} )

IconStyles.defaultProps = {
	version: '',
}

IconStyles.Content = props => {
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
			<Icon.Style.Content { ...props } { ...iconStyleOptions } />
		</BlockCssCompiler>
	)
}

IconStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
