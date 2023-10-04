import { addAttributes } from './attributes'
import { Style } from './style'
import { Edit } from './edit'

import classnames from 'classnames'
import { Div } from '~stackable/components'
import { getUniqueBlockClass, useQueryLoopInstanceId } from '~stackable/util'
import { useBlockAttributesContext } from '~stackable/hooks'
import { applyFilters } from '@wordpress/hooks'

export { deprecateContainerBackgroundColorOpacity } from './deprecated'

export const ContainerDiv = props => {
	const attributes = useBlockAttributesContext( attributes => {
		return {
			uniqueId: attributes.uniqueId,
			hasContainer: attributes.hasContainer,
			triggerHoverState: attributes.triggerHoverState,
			containerBackgroundMediaUrl: attributes.containerBackgroundMediaUrl,
			containerBackgroundMediaUrlTablet: attributes.containerBackgroundMediaUrlTablet,
			containerBackgroundMediaUrlMobile: attributes.containerBackgroundMediaUrlMobile,
			containerBackgroundColorType: attributes.containerBackgroundColorType,
		}
	} )
	const instanceId = useQueryLoopInstanceId( attributes.uniqueId )
	let uniqueBlockClass = getUniqueBlockClass( attributes.uniqueId )
	uniqueBlockClass = instanceId ? uniqueBlockClass + `-${ instanceId }` : uniqueBlockClass
	const uniqueContainerClass = applyFilters( 'stackable.container-div.uniqueClass.edit', `${ uniqueBlockClass }-container`, uniqueBlockClass )

	const classNames = classnames( [
		props.className,
		'stk-container',
		uniqueContainerClass,
	], {
		'stk-hover-parent': attributes.hasContainer && attributes.triggerHoverState, // This is needed to trigger parent-hover hover styles.
		'stk--no-background': ! attributes.hasContainer,
		'stk--no-padding': ! attributes.hasContainer,
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

	const uniqueContainerClass = applyFilters( 'stackable.container-div.uniqueClass.save', `stk-${ attributes.uniqueId }-container`, `stk-${ attributes.uniqueId }`, attributes )

	const classNames = classnames( [
		props.className,
		'stk-container',
		uniqueContainerClass,
	], {
		'stk-hover-parent': attributes.hasContainer && attributes.triggerHoverState, // This is needed to trigger parent-hover hover styles.
		'stk--no-background': ! attributes.hasContainer,
		'stk--no-padding': ! attributes.hasContainer,
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
