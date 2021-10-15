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
	Separator,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import {
	useDeviceType, useBlockAttributes,
} from '~stackable/hooks'
import {
	getUniqueBlockClass,
} from '~stackable/util'

/**
 * WordPress dependencies
 */
import {
	Fragment, renderToString,
} from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const containerDivOptions = {
	sizeSelector: '.stk-block-call-to-action__content',
	sizeHorizontalAlignRule: 'margin',
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

	return (
		<Fragment>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<ContainerDiv.Style { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style { ...propsToPass } />
			<Separator.Style { ...propsToPass } />
			<ContentAlign.Style { ...propsToPass } />
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

	const styles = (
		<Fragment>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<ContainerDiv.Style.Content { ...propsToPass } options={ containerDivOptions } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<Separator.Style.Content { ...propsToPass } />
			<ContentAlign.Style.Content { ...propsToPass } />
		</Fragment>
	)

	return renderToString( styles ) ? <style>{ styles }</style> : null
}

ContainerStyles.Content.defaultProps = {
	attributes: {},
}
