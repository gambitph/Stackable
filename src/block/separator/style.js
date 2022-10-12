/**
 * External dependencies
 */
import {
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
	SeparatorStyles as SeparatorStyles_,
} from '~stackable/block-components'
import { BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { applyFilters } from '@wordpress/hooks'

const separatorOptions = {
	selector: '',
	enableFlipVertically: true,
	isInitiallyFlippedVertically: false,
	wrapperSelector: '.stk-block-separator__inner',
}

export const SeparatorStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Transform.Style { ...props } />
			<SeparatorStyles_ { ...props } { ...separatorOptions } location="" />
			{ applyFilters( 'stackable.block-component.separator.get-style-params', null, {
				...props,
				...separatorOptions,
				location: '',
			} ) }
		</>
	)
} )

SeparatorStyles.defaultProps = {
	version: '',
}

SeparatorStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<SeparatorStyles_ { ...props } { ...separatorOptions } location="" />
			{ applyFilters( 'stackable.block-component.separator.get-style-params', null, {
				...props,
				...separatorOptions,
				location: '',
			} ) }
		</BlockCssCompiler>
	)
}

SeparatorStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}
