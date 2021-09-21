/**
 * External dependencies
 */
import {
	BlockDiv,
	Alignment,
	Advanced,
	EffectsAnimations,
	ContainerDiv,
	MarginBottom,
	Transform,
} from '~stackable/block-components'
import {
	Style as StyleComponent,
} from '~stackable/components'
import {
	useDeviceType, useBlockAttributes,
} from '~stackable/hooks'
import {
	getUniqueBlockClass,
	useStyles,
	getStyles,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	Fragment, renderToString,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const containerDivOptions = {
	sizeSelector: '.stk-block-notification__content',
	sizeVerticalAlignRule: 'justifyContent',
	sizeHorizontalAlignRule: 'alignSelf',
}

const getStyleParams = () => {
	return [
		{
			selector: '.stk-container',
			attrName: 'dismissibleSize',
			styleRule: 'paddingInlineEnd',
			enabledCallback: getAttribute => getAttribute( 'isDismissible' ) && getAttribute( 'dismissibleSize' ),
			valuePreCallback: value => value + 44, // 44 is an arbitrary number based on the size of the container paddings vs the close button size.
			format: '%spx',
		},
		{
			selector: '.stk-block-notification__close-button svg',
			attrName: 'dismissibleColor',
			styleRule: 'fill',
			enabledCallback: getAttribute => getAttribute( 'isDismissible' ),
		},
	]
}

export const ContainerStyles = props => {
	const {
		...propsToPass
	} = props

	const deviceType = useDeviceType()
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	propsToPass.blockUniqueClassName = getUniqueBlockClass( attributes.uniqueId )
	propsToPass.deviceType = deviceType
	propsToPass.attributes = { ...attributes, clientId }

	const styles = useStyles( attributes, getStyleParams() )

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<ContainerDiv.Style { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style { ...propsToPass } />
			<StyleComponent
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)
}

ContainerStyles.defaultProps = {
	isEditor: false,
}

ContainerStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	const styles = getStyles( propsToPass.attributes, getStyleParams() )

	const stylesToRender = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<StyleComponent.Content
				styles={ styles }
				versionAdded="3.0.0"
				versionDeprecated=""
				{ ...propsToPass }
			/>
		</Fragment>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

ContainerStyles.Content.defaultProps = {
	attributes: {},
}
