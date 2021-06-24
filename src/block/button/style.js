
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	Typography,
	Icon,
	BorderStyle,
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
	}

	return (
		<Fragment>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Button.Style { ...propsToPass } />
			<Typography.Style { ...propsToPass } />
			<Icon.Style
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__svg-wrapper > .stk-button__inner-svg',
						hoverSelector: '.stk-button__button:hover > .stk-button__svg-wrapper > .stk-button__inner-svg',
						wrapperSelector: '.stk-button__button',
					},
				} } />
			<BorderStyle
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						attrNameTemplate: 'button%s',
					},
				} }
			/>
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
	}

	const styles = (
		<Fragment>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...propsToPass } />
			<Icon.Style.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__svg-wrapper > .stk-button__inner-svg',
						hoverSelector: '.stk-button__button:hover > .stk-button__svg-wrapper > .stk-button__inner-svg',
						wrapperSelector: '.stk-button__button',
					},
				} } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
