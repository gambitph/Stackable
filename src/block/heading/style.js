/**
 * External dependencies
 */
import {
	BlockDiv,
	Advanced,
	Typography,
	Alignment,
	MarginBottom,
} from '~stackable/block-components'
import { getUniqueBlockClass } from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { useBlockEditContext } from '@wordpress/block-editor'

/**
 * WordPress dependencies
 */
import { Fragment, renderToString } from '@wordpress/element'

export const HeadingStyles = props => {
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
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Typography.Style { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-heading__text',
					hoverSelector: '.stk-heading__text:hover',
				},
			} } />
			<MarginBottom.Style { ...propsToPass } />
		</Fragment>
	)
}

HeadingStyles.defaultProps = {
	isEditor: false,
	attributes: {},
	options: {},
}

HeadingStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-heading__text',
					hoverSelector: '.stk-heading__text:hover',
				},
			} } />
			<MarginBottom.Style.Content { ...propsToPass } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

HeadingStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}
