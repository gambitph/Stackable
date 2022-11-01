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
	selector: '.stk-progress-circle__inner-text',
}

const ProgressCircleStyles = memo( props => {
	return (
		<>
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<ProgressBar.Style { ...props } isCircle={ true } />
			<Typography.Style { ...props } { ...typographyOptions } />
		</>
	)
} )

ProgressCircleStyles.defaultProps = {
	version: '',
}

ProgressCircleStyles.Content = props => {
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
			<ProgressBar.Style.Content { ...props } isCircle={ true } />
			<Typography.Style.Content { ...props } { ...typographyOptions } />
		</BlockCssCompiler>
	)
}

ProgressCircleStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

export default ProgressCircleStyles
