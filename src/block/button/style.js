
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	Typography,
} from '~stackable/block-components'
import { getUniqueBlockClass } from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'

/**
 * WordPress dependencies
 */
import { Fragment, renderToString } from '@wordpress/element'

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
		selector: '.stk-button__button',
		hoverSelector: '.stk-button__button:hover',
		textSelector: '.stk-button__button > .stk-button__inner-text',
		textHoverSelector: '.stk-button__button:hover > .stk-button__inner-text',
		iconSelector: '.stk-button__button .stk--inner-svg',
		iconHoverSelector: '.stk-button__button:hover .stk-inner-svg',
	}

	return (
		<Fragment>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Button.Style { ...propsToPass } />
			<Typography.Style { ...propsToPass } />
		</Fragment>
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
		selector: '.stk-button__button',
		hoverSelector: '.stk-button__button:hover',
		textSelector: '.stk-button__button > .stk-button__inner-text',
		textHoverSelector: '.stk-button__button:hover > .stk-button__inner-text',
		iconSelector: '.stk-button__button .stk--inner-svg',
		iconHoverSelector: '.stk-button__button:hover .stk-inner-svg',
	}

	const styles = (
		<Fragment>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
