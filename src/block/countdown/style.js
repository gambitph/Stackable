/**
 * External dependencies
 */
import {
	BlockDiv,
	ContainerDiv,
	Advanced,
	Alignment,
	MarginBottom,
	EffectsAnimations,
	Transform,
	Typography,
	Divider,
} from '~stackable/block-components'
import { BlockCssCompiler } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const containerDivOptions = {
	sizeSelector: '.stk-block-countdown__content',
	sizeHorizontalAlignRule: 'margin',
	wrapperSelector: '.%s-container',
}

const digitTypographyOptions = {
	selector: '.stk-block-countdown__digit',
	hoverSelector: '.stk-block-countdown__label:hover',
	attrNameTemplate: 'digit%s',
}

const labelTypographyOptions = {
	selector: '.stk-block-countdown__label',
	hoverSelector: '.stk-block-countdown__label:hover',
	attrNameTemplate: 'label%s',
}

const dividerOptions = {
	selector: '.stk-block-countdown__divider',
}

export const CountdownStyles = memo( props => {
	return (
		<>
			<Divider.Style { ...props } { ...dividerOptions } />
			<ContainerDiv.Style { ...props } { ...containerDivOptions } />
			<Typography.Style { ...props } { ...digitTypographyOptions } />
			<Typography.Style { ...props } { ...labelTypographyOptions } />
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

CountdownStyles.defaultProps = {
	version: '',
}

CountdownStyles.Content = props => {
	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	return (
		<BlockCssCompiler>
			<Divider.Style.Content { ...props } />
			<Alignment.Style.Content { ...props } />
			<BlockDiv.Style.Content { ...props } />
			<ContainerDiv.Style.Content { ...props } { ...containerDivOptions } />
			<Typography.Style.Content { ...props } { ...digitTypographyOptions } />
			<Typography.Style.Content { ...props } { ...labelTypographyOptions } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
		</BlockCssCompiler>
	)
}

CountdownStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

