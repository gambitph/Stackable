
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	Typography,
	EffectsAnimations,
} from '~stackable/block-components'
import { getUniqueBlockClass } from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'

/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element'

export const ButtonStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }
	propsToPass.options = {
		...propsToPass.options,
		selector: '.stk-button',
		hoverSelector: '.stk-button:hover',
		textSelector: '.stk-button > .stk-button__inner-text',
		textHoverSelector: '.stk-button:hover > .stk-button__inner-text',
	}

	return (
		<>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Button.Style { ...propsToPass } />
			<Typography.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
		</>
	)
}

ButtonStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

ButtonStyles.Content = props => {
	const {
		options = {},
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( propsToPass.attributes.uniqueId )
	propsToPass.options = {
		...options,
		selector: '.stk-button',
		hoverSelector: '.stk-button:hover',
		textSelector: '.stk-button > .stk-button__inner-text',
		textHoverSelector: '.stk-button:hover > .stk-button__inner-text',
	}

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
