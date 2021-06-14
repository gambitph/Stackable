
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	BlockDiv,
	BorderStyle,
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
		attrNameTemplate: 'button%s',
	}

	return (
		<Fragment>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Button.Style { ...propsToPass } />
			<BorderStyle { ...propsToPass } />
			<BorderStyle
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: propsToPass.options.selector + ':hover',
						attrNameTemplate: 'buttonHover%s',
					},
				} } />
			<Typography.Style
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__inner-text',
						attrNameTemplate: '%s',
					},
				} } />
			<Typography.Style
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button:hover > .stk-button__inner-text',
						attrNameTemplate: 'hover%s',
					},
				} } />
			<Icon.Style
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__svg-wrapper > .stk-button__inner-svg',
						wrapperSelector: '.stk-button__button',
						attrNameTemplate: '%s',
					},
				} } />
			<Icon.Style
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button:hover > .stk-button__svg-wrapper > .stk-button__inner-svg',
						backgroundShapeSelector: '.stk-button__button:hover .stk--shape-icon',
						wrapperSelector: '.stk-button__button:hover',
						attrNameTemplate: 'hover%s',
						normalAttrNameTemplate: '%s',
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
		attrNameTemplate: 'button%s',
	}

	const styles = (
		<Fragment>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } />
			<BorderStyle.Content { ...propsToPass } />
			<BorderStyle.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: propsToPass.options.selector + ':hover',
						attrNameTemplate: 'buttonHover%s',
					},
				} } />
			<Typography.Style.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__inner-text',
						attrNameTemplate: '%s',
					},
				} } />
			<Typography.Style.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button:hover > .stk-button__inner-text',
						attrNameTemplate: 'hover%s',
					},
				} } />
			<Icon.Style.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button > .stk-button__svg-wrapper > .stk-button__inner-svg',
						wrapperSelector: '.stk-button__button',
						attrNameTemplate: '%s',
					},
				} } />
			<Icon.Style.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: '.stk-button__button:hover > .stk-button__svg-wrapper > .stk-button__inner-svg',
						backgroundShapeSelector: '.stk-button__button:hover .stk--shape-icon',
						wrapperSelector: '.stk-button__button:hover',
						attrNameTemplate: 'hover%s',
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
