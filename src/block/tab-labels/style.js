/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
} from '~stackable/block-components'
import { BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

export const TabLabelStyle = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
		</>
	)
} )

TabLabelStyle.defaultProps = {
	version: '',
}

TabLabelStyle.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<BlockDiv.Style.Content { ...props } />
			<Advanced.Style.Content { ...props } />
		</BlockCssCompiler>
	)
}

TabLabelStyle.Content.defaultProps = {
	version: '',
	attributes: {},
}

