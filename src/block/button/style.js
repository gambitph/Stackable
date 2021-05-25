
/**
 * External dependencies
 */
import {
	Advanced,
	Button,
	Column,
	BlockDiv,
	BorderStyle,
	Typography,
} from '~stackable/block-components'
import { getUniqueBlockClass } from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'

/**
 * WordPress dependencies
 */
import { Fragment, renderToString } from '@wordpress/element'
import { sprintf } from '@wordpress/i18n'

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
			<Column.Style { ...{ ...propsToPass, options: { ...propsToPass.options, selector: '' } } } />
			<Advanced.Style { ...propsToPass } />
			<Button.Style { ...propsToPass } />
			<BorderStyle { ...propsToPass } />
			<BorderStyle
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: propsToPass.options.selector + ':hover',
						attrNameTemplate: sprintf( propsToPass.options.attrNameTemplate, 'Hover%s' ),
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
			<Column.Style.Content { ...{ ...propsToPass, options: { ...propsToPass.options, selector: '' } } } />
			<Advanced.Style.Content { ...propsToPass } />
			<Button.Style.Content { ...propsToPass } />
			<BorderStyle.Content { ...propsToPass } />
			<BorderStyle.Content
				{ ...{
					...propsToPass,
					options: {
						...propsToPass.options,
						selector: propsToPass.options.selector + ':hover',
						attrNameTemplate: sprintf( props.options.attrNameTemplate, 'Hover%s' ),
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
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
