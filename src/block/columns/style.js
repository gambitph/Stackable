/**
 * External dependencies
 */
import {
	Advanced,
	Alignment,
	BlockDiv,
	EffectsAnimations,
	MarginBottom,
	Separator,
	Transform,
	ContentAlign,
} from '~stackable/block-components'
import {
	useBlockAttributes, useDeviceType,
} from '~stackable/hooks'
import {
	getUniqueBlockClass,
} from '~stackable/util'
import { renderToString } from '@wordpress/element'
import { useBlockEditContext } from '@wordpress/block-editor'

const BlockStyles = props => {
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
	}

	return (
		<>
			<Alignment.Style { ...propsToPass } />
			<BlockDiv.Style { ...propsToPass } />
			<MarginBottom.Style { ...propsToPass } />
			<Advanced.Style { ...propsToPass } />
			<Transform.Style { ...propsToPass } />
			<EffectsAnimations.Style { ...propsToPass } />
			<Separator.Style { ...propsToPass } />
			<ContentAlign.Style { ...propsToPass } />
		</>
	)
}

BlockStyles.defaultProps = {
	isEditor: false,
}

BlockStyles.Content = props => {
	const {
		...propsToPass
	} = props

	propsToPass.blockUniqueClassName = getUniqueBlockClass( props.attributes.uniqueId )
	propsToPass.options = {
		...propsToPass.options,
	}

	const stylesToRender = (
		<>
			<Alignment.Style.Content { ...propsToPass } />
			<BlockDiv.Style.Content { ...propsToPass } />
			<MarginBottom.Style.Content { ...propsToPass } />
			<Advanced.Style.Content { ...propsToPass } />
			<Transform.Style.Content { ...propsToPass } />
			<EffectsAnimations.Style.Content { ...propsToPass } />
			<Separator.Style.Content { ...propsToPass } />
			<ContentAlign.Style.Content { ...propsToPass } />
		</>
	)

	return renderToString( stylesToRender ) ? <style>{ stylesToRender }</style> : null
}

BlockStyles.Content.defaultProps = {
	attributes: {},
}

export default BlockStyles
