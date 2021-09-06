
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
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'

/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element'

const buttonOptions = {
	selector: '.stk-button',
}

const typographyOptions = {
	selector: '.stk-button > .stk-button__inner-text',
	hoverSelector: '.stk-button:hover > .stk-button__inner-text',
}

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

	return (
		<>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<Button.Style { ...propsToPass } options={ buttonOptions } />
			<Typography.Style { ...propsToPass } options={ typographyOptions } />
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
		...propsToPass
	} = props

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
