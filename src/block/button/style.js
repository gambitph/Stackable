
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
import { getUniqueBlockClass } from '~stackable/util'

/**
 * WordPress dependencies
 */
import { memo, renderToString } from '@wordpress/element'

const buttonOptions = {
	selector: '.stk-button',
}

const typographyOptions = {
	selector: '.stk-button__inner-text',
	hoverSelector: '.stk-button:hover .stk-button__inner-text',
}

export const ButtonStyles = memo( props => {
	return (
		<>
			<BlockDiv.Style { ...props } />
			<Advanced.Style { ...props } />
			<Transform.Style { ...props } />
			<Button.Style { ...props } { ...buttonOptions } />
			<Typography.Style { ...props } { ...typographyOptions } />
			<EffectsAnimations.Style { ...props } />
		</>
	)
} )

ButtonStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

ButtonStyles.Content = props => {
	const {
		...propsToPass
	} = props

	if ( props.attributes.generatedCss ) {
		return <style>{ props.attributes.generatedCss }</style>
	}

	propsToPass.blockUniqueClassName = getUniqueBlockClass( propsToPass.attributes.uniqueId )

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } options={ buttonOptions } />
			<Typography.Style.Content { ...propsToPass } options={ typographyOptions } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
