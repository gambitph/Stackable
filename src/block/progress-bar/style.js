/**
 * External dependencies
 */
import {
	Alignment,
	Advanced,
	BlockDiv,
	EffectsAnimations,
	Transform,
	ProgressBar,
	Typography,
} from '~stackable/block-components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'
import { BlockCssCompiler } from '~stackable/components'

const typographyOptions = {
	selector: '.stk-progress-bar__inner-text',
}

const ProgressBarStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ProgressBar.Style { ...props } />
			<Typography.Style { ...props } { ...typographyOptions } />
		</>
	)
} )

ProgressBarStyles.defaultProps = {
	version: '',
}

ProgressBarStyles.Content = props => {
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
			<ProgressBar.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
		</BlockCssCompiler>
	)
}

ProgressBarStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default ProgressBarStyles
