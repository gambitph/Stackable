import { addAttributes } from './attributes'
import { Style } from './style'
import { Edit } from './edit'

import classnames from 'classnames'
import { Div } from '~stackable/components'
import { useBlockAttributes } from '~stackable/hooks'

import { useBlockEditContext } from '@wordpress/block-editor'

export const ContainerDiv = props => {
	const { clientId } = useBlockEditContext()
	const attributes = useBlockAttributes( clientId )

	const classNames = classnames( [
		props.className,
		'stk-container',
	], {
		'stk--no-background': ! attributes.hasContainer,
	} )

	return <Div
		{ ...props }
		className={ classNames }
		hasBackground={ attributes.hasContainer }
		backgroundUrl={ attributes.containerBackgroundMediaUrl }
		backgroundUrlTablet={ attributes.containerBackgroundMediaUrlTablet }
		backgroundUrlMobile={ attributes.containerBackgroundMediaUrlMobile }
		backgroundColorType={ attributes.containerBackgroundColorType }
	/>
}

ContainerDiv.defaultProps = {
	className: '',
}

ContainerDiv.Content = props => {
	const {
		attributes,
		...propsToPass
	} = props

	const classNames = classnames( [
		props.className,
		'stk-container',
	], {
		'stk--no-background': ! attributes.hasContainer,
	} )

	return <Div.Content
		{ ...propsToPass }
		className={ classNames }
		hasBackground={ attributes.hasContainer }
		backgroundUrl={ attributes.containerBackgroundMediaUrl }
		backgroundUrlTablet={ attributes.containerBackgroundMediaUrlTablet }
		backgroundUrlMobile={ attributes.containerBackgroundMediaUrlMobile }
		backgroundColorType={ attributes.containerBackgroundColorType }
	/>
}

ContainerDiv.Content.defaultProps = {
	className: '',
	attributes: {},
}

ContainerDiv.InspectorControls = Edit

ContainerDiv.addAttributes = addAttributes

ContainerDiv.Style = Style
