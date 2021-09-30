
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
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
	hoverSelector: '.stk-button:hover',
	textSelector: '.stk-button__inner-text',
	textHoverSelector: '.stk-button:hover .stk-button__inner-text',
}

export const IconButtonStyles = props => {
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
			<EffectsAnimations.Style { ...propsToPass } />
		</>
	)
}

IconButtonStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

IconButtonStyles.Content = props => {
	const {
		options = {},
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( propsToPass.attributes.uniqueId )
	propsToPass.options = {
		...options,
		selector: '.stk-button',
		hoverSelector: '.stk-button:hover',
		textSelector: '.stk-button__inner-text',
		textHoverSelector: '.stk-button:hover .stk-button__inner-text',
	}

	const styles = (
		<>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } options={ buttonOptions } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

IconButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
