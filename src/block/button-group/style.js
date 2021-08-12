/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
} from '~stackable/block-components'
import {
	useBlockAttributes, useDeviceType,
} from '~stackable/hooks'
import {
	getUniqueBlockClass, useStyles, getStyles,
} from '~stackable/util'
import { Style as StyleComponent } from '~stackable/components'

/**
 * WordPress dependencies
 */
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const getStyleParams = () => {
	return [
		{
			renderIn: 'edit',
			selector: '.block-editor-block-list__layout',
			styles: {
				columnGap: 'columnGap',
				rowGap: 'rowGap',
			},
			format: '%spx',
			responsive: 'all',
		},
		{
			renderIn: 'save',
			selector: '.stk-inner-blocks',
			styles: {
				columnGap: 'columnGap',
				rowGap: 'rowGap',
			},
			format: '%spx',
			responsive: 'all',
		},
	]
}

export const ButtonGroupStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const buttonGroupStyles = useStyles( propsToPass.attributes, getStyleParams() )

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<MarginBottom.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<StyleComponent
				styles={ buttonGroupStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)
}

ButtonGroupStyles.defaultProps = {
	isEditor: false,
}

ButtonGroupStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )

	const buttonGroupStyles = getStyles( propsToPass.attributes, getStyleParams() )

	const styles = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ buttonGroupStyles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ButtonGroupStyles.Content.defaultProps = {
	attributes: {},
}

