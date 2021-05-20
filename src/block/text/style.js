/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
} from '~stackable/block-components'
import { getUniqueBlockClass } from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'

/**
 * WordPress dependencies
 */
import { Fragment, renderToString } from '@wordpress/element'

export const TextStyles = props => {
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
		<Fragment>
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Typography.Style { ...{ ...{ ...propsToPass, options: { ...propsToPass.options, selector: '.stk-advanced-text__text' } } } } />
		</Fragment>
	)
}

TextStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

TextStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const styles = (
		<Fragment>
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...{ ...{ ...propsToPass, options: { ...propsToPass.options, selector: '.stk-advanced-text__text' } } } } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

TextStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}

