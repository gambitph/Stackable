import { Divider } from './divider'

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
} from '~stackable/block-components'
import { BlockCssCompiler, BlockCss } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { memo } from '@wordpress/element'

const digitTypographyOptions = {
	selector: '.stk-block-countdown__digit',
	hoverSelector: '.stk-block-countdown__digit:hover',
	attrNameTemplate: 'digit%s',
}

const labelTypographyOptions = {
	selector: '.stk-block-countdown__label',
	hoverSelector: '.stk-block-countdown__label:hover',
	attrNameTemplate: 'label%s',
}

const messageTypographyOptions = {
	selector: '.stk-block-countdown__message',
	hoverSelector: '.stk-block-countdown__message:hover',
	attrNameTemplate: 'message%s',
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
				selector=".%s.stk-block-countdown .stk-block-countdown__container"
				styleRule="display"
				responsive="all"
				attrName="contentAlignment"
				valueCallback={ () => {
					return 'flex'
				} }
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s.stk-block-countdown .stk-block-countdown__container"
				styleRule="justifyContent"
				attrName="contentAlignment"
				key="contentAlignment"
				responsive="all"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".%s.stk-block-countdown .stk-block-countdown__container"
				styleRule="gap"
				attrName="boxGap"
				key="boxGap"
				responsive="all"
				hasUnits="px"
			/>
			<BlockCss
				{ ...propsToPass }
				selector=".stk-block-countdown__label"
				styleRule="marginTop"
				attrName="labelMarginTop"
				key="labelMarginTop"
				responsive="all"
				hasUnits="px"
			/>
		</>
	)
}

export const CountdownStyles = memo( props => {
	return (
		<>
			<Divider.Style { ...props } />
			<ContainerDiv.Style { ...props } />
			<Typography.Style { ...props } { ...digitTypographyOptions } />
			<Typography.Style { ...props } { ...labelTypographyOptions } />
			<Typography.Style { ...props } { ...messageTypographyOptions } />
			<Alignment.Style { ...props } />
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<EffectsAnimations.Style { ...props } />
			<Styles { ...props } />
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
			<ContainerDiv.Style.Content { ...props } />
			<Typography.Style.Content { ...props } { ...digitTypographyOptions } />
			<Typography.Style.Content { ...props } { ...labelTypographyOptions } />
			<Typography.Style.Content { ...props } { ...messageTypographyOptions } />
			<Advanced.Style.Content { ...props } />
			<Transform.Style.Content { ...props } />
			<EffectsAnimations.Style.Content { ...props } />
			<MarginBottom.Style.Content { ...props } />
			<Styles { ...props } />
		</BlockCssCompiler>
	)
}

CountdownStyles.Content.defaultProps = {
	version: '',
	attributes: {},
}

