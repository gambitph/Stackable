
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	Typography,
	Icon,
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
	}

	return (
		<Fragment>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Button.Style { ...propsToPass } />
			<Typography.Style
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__inner-text',
						hoverSelector: '.stk-button__button:hover > .stk-button__inner-text',
					},
				} } />
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
	}

	const styles = (
		<Fragment>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } />
			<Typography.Style.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__inner-text',
						hoverSelector: '.stk-button__button:hover > .stk-button__inner-text',
					},
				} } />
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
