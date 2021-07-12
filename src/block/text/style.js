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
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { useDeviceType, useBlockAttributes } from '~stackable/hooks'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { Fragment, renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = () => {
	return [
		{
			selector: '',
			styleRule: 'columnCount',
			attrName: 'columns',
			responsive: 'all',
		},
		{
			selector: '',
			styleRule: 'columnGap',
			attrName: 'columnGap',
			responsive: 'all',
			format: '%spx',
		},
	]
}

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

	const columnStyles = useStyles( attributes, getStyleParams() )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Typography.Style { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-text__text',
					hoverSelector: '.stk-text__text:hover',
				},
			} } />
			<StyleComponent
				styles={ columnStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
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
	const columnStyles = getStyles( props.attributes, getStyleParams() )

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Typography.Style.Content { ...{
				...propsToPass,
				options: {
					...propsToPass.options,
					selector: '.stk-text__text',
					hoverSelector: '.stk-text__text:hover',
				},
			} } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ columnStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

TextStyles.Content.defaultProps = {
	attributes: {},
	options: {},
}

